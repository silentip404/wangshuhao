import type { Config } from 'eslint/config';
import { defineConfig } from 'eslint/config';
import { isDefined, map, pipe, set } from 'remeda';

interface ScopedFiles {
  files: readonly string[] | string[];
  ignores?: readonly string[] | string[];
}

const defineScopedConfig = (
  scopedFiles: ScopedFiles,
  configs: Parameters<typeof defineConfig>,
): Config[] => {
  const { files, ignores } = scopedFiles;

  return pipe(
    defineConfig(configs),
    map((config) => set(config, 'files', [...files])),
    map((config) => {
      if (!isDefined(ignores)) {
        return config;
      }

      return set(config, 'ignores', [...ignores, ...(config.ignores ?? [])]);
    }),
  );
};

export type { ScopedFiles };

export { defineScopedConfig };
