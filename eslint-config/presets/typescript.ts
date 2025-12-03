import { defineConfig } from 'eslint/config';
import { configs } from 'typescript-eslint';

const typescriptPresets = defineConfig([
  configs.strictTypeChecked,
  configs.stylisticTypeChecked,
  { languageOptions: { parserOptions: { projectService: true } } },
]);

export { typescriptPresets };
