import { readFile } from 'node:fs/promises';
import { availableParallelism } from 'node:os';
import path from 'node:path';
import { styleText } from 'node:util';

import { init, parse as parseEsModuleLexer } from 'es-module-lexer';
import pMap from 'p-map';
import {
  concat,
  filter,
  flatMap,
  forEach,
  isEmptyish,
  isError,
  isIncludedIn,
  isPlainObject,
  isTruthy,
  join,
  map,
  omit,
  pipe,
  split,
} from 'remeda';
import { glob } from 'tinyglobby';
import { parse as parseArguments } from 'ts-command-line-args';

import { printMessage } from '#lib/utilities/print-message.ts';
import { ensureModulePathsInPackage } from '#node/utilities/ensure.ts';
import {
  GLOB_TSCONFIG_LIB_INCLUDE,
  GLOB_TSCONFIG_NODE_INCLUDE,
} from '#node/utilities/globs.ts';
import { isNpmPackage, parsePackageName } from '#node/utilities/package.ts';
import {
  resolveFromRoot,
  ROOT,
  toRelativePosixPath,
} from '#node/utilities/path.ts';

import type { VerifyFilesArguments, WithHelpArgument } from './utilities.ts';
import {
  analyzeVerifyFiles,
  helpArgumentConfig,
  helpArgumentOptions,
  verifyFilesArgumentsConfig,
} from './utilities.ts';

const WHITELIST = new Set<string>(await ensureModulePathsInPackage([]));
const ALL_RELATED_FILES_PATTERNS = concat(
  GLOB_TSCONFIG_LIB_INCLUDE,
  GLOB_TSCONFIG_NODE_INCLUDE,
);

type CliArguments = WithHelpArgument<VerifyFilesArguments>;
interface FileWithImports {
  filePath: string;
  moduleImports: ModuleImport[];
}
interface ModuleImport {
  importedNames: string[];
  modulePath: string;
}
type ModuleImportResult =
  | {
      errorMessage: string;
      isSuccess: false;
    }
  | {
      isSuccess: true;
      errorMessage?: undefined;
    };
type VerificationResult = ModuleImportResult & {
  exportedNames: string[];
  modulePath: string;
  packageName: string;
  sourceFiles: Set<string>;
};

const cliArguments = parseArguments<CliArguments>(
  {
    ...helpArgumentConfig,
    ...verifyFilesArgumentsConfig,
  },
  {
    ...helpArgumentOptions,

    headerContentSections: [
      {
        header: path.basename(import.meta.url),
        content: '验证 Node.js 运行时模块导入是否正确',
      },
    ],
  },
);

const options = omit(cliArguments, ['help']);

const { files, 'ignore-unknown': shouldIgnoreUnknown } = options;

await init;

const MAX_CONCURRENCY = 50;
const MIN_CONCURRENCY = 20;
const CONCURRENCY_FACTOR = 3;
const CONCURRENCY = Math.min(
  MAX_CONCURRENCY,
  Math.max(MIN_CONCURRENCY, availableParallelism() * CONCURRENCY_FACTOR),
);

const TYPE_ONLY_REGEX = /(?:export|import)\s+type\b/v;
const NAMESPACE_IMPORT_REGEX = /\*\s*as\s+/v;
const DEFAULT_IMPORT_REGEX = /import\s+\w+\s+from/v;
const NAMED_IMPORTS_REGEX = /\{(?<specifiers>[^\}]+)\}/v;
const SPECIFIER_TYPE_PREFIX_REGEX = /^type\s+/v;
const AS_RENAME_REGEX = /\s+as\s+/v;

const allRelatedFiles = await glob(ALL_RELATED_FILES_PATTERNS, {
  cwd: ROOT,
});
const { shouldRunVerification, relatedFiles } = analyzeVerifyFiles({
  files,
  allRelatedFiles,
  shouldIgnoreUnknown,
  unknownErrorTitle: '以下文件与 Node.js 运行时模块导入验证无关:',
});

if (!shouldRunVerification) {
  process.exit(0);
}

const shouldVerifyFile = (filePath: string): boolean => {
  if (files === undefined) {
    return true;
  }

  return isIncludedIn(filePath, relatedFiles);
};

const extractModuleImports = (sourceCode: string): ModuleImport[] => {
  const moduleImportedNamesMap = new Map<string, Set<string>>();
  const [importStatements] = parseEsModuleLexer(sourceCode);

  forEach(
    importStatements,
    ({ n: moduleName, ss: statementStart, se: statementEnd }) => {
      if (moduleName === undefined) {
        return;
      }

      const statement = sourceCode.slice(statementStart, statementEnd);

      if (
        TYPE_ONLY_REGEX.test(statement) ||
        NAMESPACE_IMPORT_REGEX.test(statement)
      ) {
        return;
      }

      if (!moduleImportedNamesMap.has(moduleName)) {
        moduleImportedNamesMap.set(moduleName, new Set());
      }

      const importedNamesSet = moduleImportedNamesMap.get(moduleName);

      if (importedNamesSet === undefined) {
        return;
      }

      if (DEFAULT_IMPORT_REGEX.test(statement)) {
        importedNamesSet.add('default');
      }

      const namedImportsCapture = NAMED_IMPORTS_REGEX.exec(statement);

      if (namedImportsCapture === null) {
        return;
      }

      pipe(
        namedImportsCapture.groups?.['specifiers'] ?? '',
        split(','),
        map((rawSpecifier) => {
          const trimmedSpecifier = rawSpecifier.trim();
          const specifierWithoutType = trimmedSpecifier.replace(
            SPECIFIER_TYPE_PREFIX_REGEX,
            '',
          );

          if (specifierWithoutType !== trimmedSpecifier) {
            return '';
          }

          return split(specifierWithoutType, AS_RENAME_REGEX)[0]?.trim();
        }),
        filter(isTruthy),
        forEach((importedName) => importedNamesSet.add(importedName)),
      );
    },
  );

  return Array.from(
    moduleImportedNamesMap,
    ([modulePath, importedNamesSet]) => ({
      modulePath,
      importedNames: [...importedNamesSet],
    }),
  );
};

const verifyModuleImport = async (
  modulePath: string,
  exportedNames: string[],
): Promise<ModuleImportResult> => {
  try {
    const importedModule = (await import(modulePath)) as unknown;

    if (!isPlainObject(importedModule)) {
      return {
        isSuccess: false,
        errorMessage: '导入的模块不是对象',
      };
    }

    const missingExports = filter(
      exportedNames,
      (name) => !Object.hasOwn(importedModule, name),
    );

    return isEmptyish(missingExports)
      ? {
          isSuccess: true,
        }
      : {
          isSuccess: false,
          errorMessage: `缺少导出(${join(missingExports, ', ')})`,
        };
  } catch (error) {
    return {
      isSuccess: false,
      errorMessage: isError(error)
        ? (error.stack ?? error.message)
        : String(error),
    };
  }
};

const verificationFiles = filter(allRelatedFiles, shouldVerifyFile);

if (isEmptyish(verificationFiles)) {
  process.exit(0);
}

const filesWithImports: FileWithImports[] = await pMap(
  verificationFiles,
  async (filePath) => {
    const sourceCode = await readFile(resolveFromRoot(filePath), 'utf8');
    const moduleImports = extractModuleImports(sourceCode);

    return {
      filePath,
      moduleImports,
    };
  },
  {
    concurrency: CONCURRENCY,
  },
);

const npmPackageMap = new Map<
  string,
  {
    exportedNames: Set<string>;
    packageName: string;
    sourceFiles: Set<string>;
  }
>();

forEach(filesWithImports, ({ filePath, moduleImports }) => {
  forEach(moduleImports, ({ modulePath, importedNames }) => {
    if (!isNpmPackage(modulePath)) {
      return;
    }

    const { packageName } = parsePackageName(modulePath);

    if (!npmPackageMap.has(modulePath)) {
      npmPackageMap.set(modulePath, {
        packageName,
        exportedNames: new Set(),
        sourceFiles: new Set(),
      });
    }

    const packageInfo = npmPackageMap.get(modulePath);

    if (packageInfo === undefined) {
      return;
    }

    packageInfo.sourceFiles.add(
      toRelativePosixPath({
        filename: filePath,
        shouldAddDotSlash: true,
      }),
    );

    forEach(importedNames, (name) => packageInfo.exportedNames.add(name));
  });
});

if (isEmptyish(npmPackageMap)) {
  process.exit(0);
}

const verificationResults: VerificationResult[] = await pMap(
  npmPackageMap.entries(),
  async ([modulePath, { packageName, exportedNames, sourceFiles }]) => ({
    modulePath,
    packageName,
    exportedNames: [...exportedNames],
    sourceFiles,
    ...(await verifyModuleImport(modulePath, [...exportedNames])),
  }),
  {
    concurrency: CONCURRENCY,
  },
);

const isInWhitelist = (verification: {
  modulePath: string;
  packageName: string;
}): boolean => WHITELIST.has(verification.modulePath);

const failedVerifications = filter(
  verificationResults,
  (verification) => !verification.isSuccess && !isInWhitelist(verification),
);

const whitelistedSuccesses = filter(
  verificationResults,
  (verification) => verification.isSuccess && isInWhitelist(verification),
);

if (!isEmptyish(failedVerifications)) {
  printMessage({
    type: 'error',
    title: '模块导入验证失败',
    description: [
      ...flatMap(failedVerifications, (verification) => [
        `  - ${styleText('cyan', verification.modulePath)}`,
        '',
        `    错误原因: ${styleText('yellowBright', verification.errorMessage ?? '未知错误')}`,
        `    期望导出: ${styleText('gray', join(verification.exportedNames, ', '))}`,
        `    相关文件: ${styleText('gray', join([...verification.sourceFiles], ', '))}`,
        '',
      ]),
      '',
      styleText(
        'red',
        `发现 ${failedVerifications.length} 个模块导入错误，请检查以上模块的导入是否正确`,
      ),
    ],
  });

  process.exit(1);
}

if (!isEmptyish(whitelistedSuccesses)) {
  printMessage({
    type: 'warn',
    title: '模块导入验证 - 白名单提示',
    description: [
      ...flatMap(whitelistedSuccesses, (verification) => [
        `  - ${styleText('cyan', verification.modulePath)}`,
        '',
        `    相关文件: ${styleText('gray', join([...verification.sourceFiles], ', '))}`,
        '',
      ]),
      '',
      styleText(
        'yellow',
        `共 ${whitelistedSuccesses.length} 个模块在白名单中验证通过，请从白名单中移除`,
      ),
    ],
  });

  process.exit(1);
}
