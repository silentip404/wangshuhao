import jsxA11YPlugin from 'eslint-plugin-jsx-a11y';
import { defineConfig } from 'eslint/config';

const jsxA11yPresets = defineConfig([jsxA11YPlugin.flatConfigs.strict]);

export { jsxA11yPresets };
