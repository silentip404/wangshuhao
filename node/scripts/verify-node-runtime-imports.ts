import { readFile } from 'fs/promises';
import { availableParallelism } from 'os';
import path from 'path';
import { styleText } from 'util';

import { init, parse } from 'es-module-lexer';
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
import { parse as parseArgs } from 'ts-command-line-args';

import { printMessage } from '#lib/utils/index.ts';
import {
  analyzeVerifyFiles,
  ensureModulePathsInPackage,
  GLOB_TSCONFIG_LIB_INCLUDE,
  GLOB_TSCONFIG_NODE_INCLUDE,
  helpArgConfig,
  helpArgOptions,
  isNpmPackage,
  parsePackageName,
  resolveFromRoot,
  ROOT,
  verifyFilesArgsConfig,
} from '#node/utils/index.ts';
import type { VerifyFilesArgs, WithHelpArg } from '#node/utils/index.ts';

type CliArguments = WithHelpArg<VerifyFilesArgs>;
interface FileWithImports {
  filePath: string;
  moduleImports: ModuleImport[];
}
interface ModuleImport {
  importedNames: string[];
  modulePath: string;
}
type ModuleImportResult =
  | { error: string; success: false }
  | { success: true; error?: undefined };

type VerificationResult = ModuleImportResult & {
  exportedNames: string[];
  modulePath: string;
  packageName: string;
  sourceFiles: Set<string>;
};

const cliArguments = parseArgs<CliArguments>(
  { ...helpArgConfig, ...verifyFilesArgsConfig },
  {
    ...helpArgOptions,

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

const WHITELIST = new Set<string>(
  await ensureModulePathsInPackage(['@next/eslint-plugin-next']),
);
const ALL_RELATED_FILES_PATTERNS = concat(
  GLOB_TSCONFIG_LIB_INCLUDE,
  GLOB_TSCONFIG_NODE_INCLUDE,
);

const MAX_CONCURRENCY = 50;
const MIN_CONCURRENCY = 20;
const CONCURRENCY_FACTOR = 3;
const CONCURRENCY = Math.min(
  MAX_CONCURRENCY,
  Math.max(MIN_CONCURRENCY, availableParallelism() * CONCURRENCY_FACTOR),
);

const IMPORT_TYPE_REGEX = /import\s+type\b/v;
const NAMESPACE_IMPORT_REGEX = /\*\s*as\s+/v;
const DEFAULT_IMPORT_REGEX = /import\s+\w+\s+from/v;
const NAMED_IMPORTS_REGEX = /\{(?<specifiers>[^\}]+)\}/v;
const SPECIFIER_TYPE_PREFIX_REGEX = /^type\s+/v;
const AS_RENAME_REGEX = /\s+as\s+/v;

const allRelatedFiles = await glob(ALL_RELATED_FILES_PATTERNS, { cwd: ROOT });
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

  const [importStatements] = parse(sourceCode);

  forEach(
    importStatements,
    ({ n: moduleName, ss: statementStart, se: statementEnd }) => {
      if (moduleName === undefined) {
        return;
      }

      const statement = sourceCode.slice(statementStart, statementEnd);

      if (
        IMPORT_TYPE_REGEX.test(statement) ||
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
      importedNames: Array.from(importedNamesSet),
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
      return { success: false, error: '导入的模块不是对象' };
    }

    const missingExports = filter(
      exportedNames,
      (name) => !Object.hasOwn(importedModule, name),
    );

    return isEmptyish(missingExports)
      ? { success: true }
      : { success: false, error: `缺少导出(${join(missingExports, ', ')})` };
  } catch (error) {
    return {
      success: false,
      error: isError(error) ? (error.stack ?? error.message) : String(error),
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
    const sourceCode = await readFile(resolveFromRoot(filePath), 'utf-8');
    const moduleImports = extractModuleImports(sourceCode);

    return { filePath, moduleImports };
  },
  { concurrency: CONCURRENCY },
);

const npmPackageMap = new Map<
  string,
  { exportedNames: Set<string>; packageName: string; sourceFiles: Set<string> }
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

    packageInfo.sourceFiles.add(filePath);

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
    exportedNames: Array.from(exportedNames),
    sourceFiles,
    ...(await verifyModuleImport(modulePath, Array.from(exportedNames))),
  }),
  { concurrency: CONCURRENCY },
);

const isInWhitelist = (verification: {
  modulePath: string;
  packageName: string;
}): boolean => WHITELIST.has(verification.modulePath);

const failedVerifications = filter(
  verificationResults,
  (verification) => !verification.success && !isInWhitelist(verification),
);

const whitelistedSuccesses = filter(
  verificationResults,
  (verification) => verification.success && isInWhitelist(verification),
);

if (!isEmptyish(whitelistedSuccesses)) {
  printMessage({
    type: 'warn',
    title: '模块导入验证 - 白名单提示',
    description: [
      ...flatMap(whitelistedSuccesses, (verification) => [
        `  - ${styleText('cyan', verification.modulePath)}`,
        '',
        `    期望导出: ${styleText('gray', join(verification.exportedNames, ', '))}`,
        `    相关文件: ${styleText('gray', join(Array.from(verification.sourceFiles), ', '))}`,
        '',
      ]),
      '',
      styleText(
        'yellow',
        `共 ${whitelistedSuccesses.length} 个模块在白名单中验证通过，如已修复建议移除`,
      ),
    ],
  });
}

if (!isEmptyish(failedVerifications)) {
  printMessage({
    type: 'error',
    title: '模块导入验证失败',
    description: [
      ...flatMap(failedVerifications, (verification) => [
        `  - ${styleText('cyan', verification.modulePath)}`,
        '',
        `    错误原因: ${styleText('yellowBright', verification.error ?? '未知错误')}`,
        `    期望导出: ${styleText('gray', join(verification.exportedNames, ', '))}`,
        `    相关文件: ${styleText('gray', join(Array.from(verification.sourceFiles), ', '))}`,
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
