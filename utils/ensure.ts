import { readPackage } from 'pkg-types';
import {
  difference,
  flatMap,
  isEmptyish,
  join,
  keys,
  pickBy,
  pipe,
  toLowerCase,
  values,
} from 'remeda';

import { printError } from './print-error.ts';

const packageJSON = await readPackage();

const ensureScriptInPackage = (script: string): string => {
  if (script in (packageJSON.scripts ?? {})) {
    return script;
  }

  printError(
    new Error(
      `配置 ${JSON.stringify(script)} 未添加到 package.json 中，请检查相关配置`,
    ),
  );
  process.exit(1);
};

const ensureScriptsInPackage = (scripts: string[]): string[] => {
  const existingScripts = keys(packageJSON.scripts ?? {});

  const unusedScripts = difference(scripts, existingScripts);

  if (isEmptyish(unusedScripts)) {
    return scripts;
  }

  printError(
    new Error(
      `配置 ${JSON.stringify(scripts)} 中的 ${join(unusedScripts, ',')} 未添加到 package.json 中，请检查相关配置`,
    ),
  );
  process.exit(1);
};

const ensureDependenciesInPackage = (dependencies: string[]): string[] => {
  const existingDependencies = pipe(
    packageJSON,
    pickBy((value, key) => toLowerCase(key).endsWith('dependencies')),
    values(),
    flatMap(keys()),
  );

  const unusedDependencies = difference(dependencies, existingDependencies);

  if (isEmptyish(unusedDependencies)) {
    return dependencies;
  }

  printError(
    new Error(
      `配置 ${JSON.stringify(dependencies)} 中的 ${join(unusedDependencies, ',')} 未添加到 package.json 中，请检查相关配置`,
    ),
  );
  process.exit(1);
};

export {
  ensureScriptsInPackage,
  ensureDependenciesInPackage,
  ensureScriptInPackage,
};
