import { defineConfig } from 'eslint/config';
import { nextPreset } from './eslint-configs/presets/next';
import { importRules } from './eslint-configs/rules/import';

const eslintConfig = defineConfig([
  {
    name: 'source-code',
    files: ['**/*.d.ts', '**/*.js', '**/*.ts', '**/*.tsx'],
    languageOptions: { parserOptions: { projectService: true } },
    extends: [nextPreset, importRules],
  },
]);

export default eslintConfig;
