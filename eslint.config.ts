import { defineConfig } from 'eslint/config';
import ignore from 'eslint-config-flat-gitignore';

import { builtinOverrides } from './eslint-config/overrides/builtin.ts';
import { dependOverrides } from './eslint-config/overrides/depend.ts';
import { importOverrides } from './eslint-config/overrides/import.ts';
import { jsoncOverrides } from './eslint-config/overrides/jsonc.ts';
import { typescriptOverrides } from './eslint-config/overrides/typescript.ts';
import { builtinPresets } from './eslint-config/presets/builtin.ts';
import { dependPresets } from './eslint-config/presets/depend.ts';
import { importPresets } from './eslint-config/presets/import.ts';
import { jsoncPresets } from './eslint-config/presets/jsonc.ts';
import { prettierPresets } from './eslint-config/presets/prettier.ts';
import { typescriptPresets } from './eslint-config/presets/typescript.ts';
import {
  GLOB_DEPEND_DERIVED,
  GLOB_JSON_DERIVED,
  GLOB_JS_DERIVED,
} from './utils/file-patterns.ts';

import type { SetRequired } from 'type-fest';
import type { ConfigWithExtends } from 'typescript-eslint';

const eslintConfig = defineConfig([
  /**
   * 全局忽略配置
   */
  { ...ignore({ root: true, files: ['.gitignore'] }), name: 'global:ignore' },

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
   * 依赖项使用限制预设配置
   */
  {
    name: 'depend:presets',
    files: [...GLOB_DEPEND_DERIVED],
    extends: [dependPresets],
  },

  /**
   * 依赖项使用限制覆盖配置
   */
  {
    name: 'depend:overrides',
    files: [...GLOB_DEPEND_DERIVED],
    extends: [dependOverrides],
  },

  /**
   * 其他杂项覆盖配置
   */
  {
    name: 'misc:overrides',
    extends: [
      // 允许使用 Node.js 内置模块的特例
      {
        files: ['{scripts,utils}/**/*.ts'],
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
] satisfies SetRequired<ConfigWithExtends, 'name'>[]);

export default eslintConfig;
