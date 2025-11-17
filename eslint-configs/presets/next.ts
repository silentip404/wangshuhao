import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

/**
 * Next.js 配置预设：https://nextjs.org/docs/app/api-reference/config/eslint
 *
 * 此预设已经包含了以下插件的推荐规则：
 *
 *  - 'react'
 *  - 'react-hooks'
 *  - 'import'
 *  - 'jsx-a11y'
 *  - '@next/next'
 *  - '@typescript-eslint'
 */
const nextPreset = defineConfig([
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
]);

export { nextPreset };
