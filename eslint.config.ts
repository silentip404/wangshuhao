import { defineConfig } from 'eslint/config';
import ignore from 'eslint-config-flat-gitignore';

import {
  builtinOverrides,
  builtinPresets,
  dependOverrides,
  dependPresets,
  importOverrides,
  importPresets,
  jsoncOverrides,
  jsoncPresets,
  prettierPresets,
  typescriptOverrides,
  typescriptPresets,
} from './eslint-config/index.ts';
import {
  GLOB_DEPEND_DERIVED,
  GLOB_JSON_DERIVED,
  GLOB_JS_DERIVED,
} from './utils/index.ts';

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
        files: ['*.config.{,*.}{js,ts}', '{scripts,utils}/**/*.ts'],
        rules: { 'import/no-nodejs-modules': 'off' },
      },

      // 允许使用默认导出的特例
      {
        files: ['*.config.{,*.}{js,ts}', 'app/**/{layout,page}.tsx'],
        rules: { 'import/no-default-export': 'off' },
      },
    ],
  } satisfies Pick<ConfigWithExtends, 'name' | 'extends'>,
] satisfies SetRequired<ConfigWithExtends, 'name'>[]);

export default eslintConfig;
