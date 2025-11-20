import { defineConfig } from 'eslint/config';

import { builtinOverrides } from './eslint-configs/overrides/builtin.ts';
import { importOverrides } from './eslint-configs/overrides/import.ts';
import { reactOverrides } from './eslint-configs/overrides/react.ts';
import { typescriptOverrides } from './eslint-configs/overrides/typescript.ts';
import { builtinPreset } from './eslint-configs/presets/builtin.ts';
import { nextPreset } from './eslint-configs/presets/next.ts';
import { prettierPreset } from './eslint-configs/presets/prettier.ts';

const eslintConfig = defineConfig([
  {
    name: 'source-code',
    files: ['**/*.d.ts', '**/*.js', '**/*.ts', '**/*.tsx'],
    languageOptions: { parserOptions: { projectService: true } },
    extends: [
      /**
       * 社区维护的预设配置
       */
      [builtinPreset, nextPreset, prettierPreset],

      /**
       * 项目自身维护的覆盖规则
       */
      [builtinOverrides, typescriptOverrides, importOverrides, reactOverrides],
    ],
  },
  {
    name: 'source-code/allow-default-export',
    files: [
      '**/*.d.ts',
      '*.config.js',
      '*.config.ts',
      '*.config.*.ts',
      'app/**/{page,layout}.tsx',
    ],
    rules: { 'import/no-default-export': 'off' },
  },
  {
    name: 'source-code/allow-nodejs-modules',
    files: ['scripts/**/*.ts'],
    rules: { 'import/no-nodejs-modules': 'off' },
  },
]);

export default eslintConfig;
