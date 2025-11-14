import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  {
    name: 'source-code',
    files: ['**/*.d.ts', '**/*.js', '**/*.ts', '**/*.tsx'],
    extends: [
      ...nextVitals,
      ...nextTypeScript,
      // Override default ignores of eslint-config-next.
      globalIgnores([
        // Default ignores of eslint-config-next:
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
      ]),

      { languageOptions: { parserOptions: { projectService: true } } },

      { rules: { 'import/enforce-node-protocol-usage': ['warn', 'always'] } },
    ],
  },
]);

export default eslintConfig;
