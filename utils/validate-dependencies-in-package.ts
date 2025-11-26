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

const localPackage = await readPackage();

const validateDependenciesInPackage = (dependencies: string[]): string[] => {
  const localDependencies = pipe(
    localPackage,
    pickBy((value, key) => toLowerCase(key).endsWith('dependencies')),
    values(),
    flatMap(keys()),
  );

  const unusedDependencies = difference(dependencies, localDependencies);

  if (isEmptyish(unusedDependencies)) {
    return dependencies;
  }

  throw new Error(
    `配置 ${JSON.stringify(dependencies)} 中的 ${join(unusedDependencies, ',')} 未添加到 package.json 中，请检查相关配置`,
  );
};

export { validateDependenciesInPackage };
