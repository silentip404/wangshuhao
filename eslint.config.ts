import { defineConfig } from 'eslint/config';
import ignore from 'eslint-config-flat-gitignore';
import depend from 'eslint-plugin-depend';

import { builtinOverrides } from './eslint-config/overrides/builtin.ts';
import { importOverrides } from './eslint-config/overrides/import.ts';
import { jsoncOverrides } from './eslint-config/overrides/jsonc.ts';
import { typescriptOverrides } from './eslint-config/overrides/typescript.ts';
import { builtinPresets } from './eslint-config/presets/builtin.ts';
import { importPresets } from './eslint-config/presets/import.ts';
import { jsoncPresets } from './eslint-config/presets/jsonc.ts';
import { prettierPresets } from './eslint-config/presets/prettier.ts';
import { typescriptPresets } from './eslint-config/presets/typescript.ts';
import { ensureDependenciesInPackage } from './utils/ensure.ts';
import { GLOB_JSON_DERIVED, GLOB_JS_DERIVED } from './utils/file-patterns.ts';

import type { ConfigWithExtends } from 'typescript-eslint';

const eslintConfig = defineConfig([
  /**
   * 全局忽略配置
   */
  ignore({ root: true, files: ['.gitignore'] }),

  /**
   * JS 派生文件预设配置
   */
  {
    name: 'js-derived:presets',
    files: [...GLOB_JS_DERIVED],
    extends: [
      builtinPresets,
      typescriptPresets,
      importPresets,
      prettierPresets,
    ],
  },

  /**
   * JS 派生文件覆盖配置
   */
  {
    name: 'js-derived:overrides',
    files: [...GLOB_JS_DERIVED],
    extends: [builtinOverrides, typescriptOverrides, importOverrides],
  },

  /**
   * JSON 派生文件预设配置
   */
  {
    name: 'json-derived:presets',
    files: [...GLOB_JSON_DERIVED],
    extends: [jsoncPresets],
  },

  /**
   * JSON 派生文件覆盖配置
   */
  {
    name: 'json-derived:overrides',
    files: [...GLOB_JSON_DERIVED],
    extends: [jsoncOverrides],
  },

  /**
   * 其他杂项覆盖配置
   */
  {
    name: 'misc:overrides',
    extends: [
      // 检查是否正在使用不推荐的依赖（有更好的替代方案）
      {
        files: ['**/package.json', ...GLOB_JS_DERIVED],
        plugins: { depend },
        rules: {
          'depend/ban-dependencies': [
            'error',
            {
              allowed: ensureDependenciesInPackage([
                // 比 nano-staged 有更好的 TypeScript 类型支持且持续活跃维护
                'lint-staged',
                // 比 eslint-plugin-import-x 有更好的 TypeScript 类型支持且持续活跃维护
                'eslint-plugin-import',
              ]),
            },
          ],
        },
      },

      // 允许使用 Node.js 内置模块的特例
      {
        files: ['scripts/**/*.ts'],
        rules: { 'import/no-nodejs-modules': 'off' },
      },

      // 允许使用默认导出的特例
      {
        files: ['*.config.{,*.}{js,ts}', 'app/**/{layout,page}.tsx'],
        rules: { 'import/no-default-export': 'off' },
      },

      // Node.js 使用 type stripping 方式运行 TypeScript 代码时，暂不支持别名系统
      {
        files: ['{scripts,eslint-config}/**/*.ts'],
        rules: { 'import/no-relative-parent-imports': 'off' },
      },
    ],
  } satisfies Pick<ConfigWithExtends, 'name' | 'extends'>,
]);

export default eslintConfig;
