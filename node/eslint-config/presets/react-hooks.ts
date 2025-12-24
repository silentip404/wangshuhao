import reactHooksPlugin from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';

const reactHooksPresets = defineConfig([
  reactHooksPlugin.configs.flat['recommended-latest'],
]);

export { reactHooksPresets };
