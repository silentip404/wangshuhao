import { readPackage } from 'pkg-types';
import { difference, isEmptyish, join, keys } from 'remeda';

const localPackage = await readPackage();

const validateScriptsInPackage = (scripts: string[]): string[] => {
  const localScripts = keys(localPackage.scripts ?? {});

  const unusedScripts = difference(scripts, localScripts);

  if (isEmptyish(unusedScripts)) {
    return scripts;
  }

  throw new Error(
    `配置 ${JSON.stringify(scripts)} 中的 ${join(unusedScripts, ',')} 未添加到 package.json 中，请检查相关配置`,
  );
};

export { validateScriptsInPackage };
