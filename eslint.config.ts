import ignore from 'eslint-config-flat-gitignore';
import { defineConfig } from 'eslint/config';
import { type SetRequired } from 'type-fest';
import { type ConfigWithExtends } from 'typescript-eslint';

import {
  builtinOverrides,
  builtinPresets,
  dependOverrides,
  dependPresets,
  importOverrides,
  importPresets,
  jsoncOverrides,
  jsoncPresets,
  perfectionistOverrides,
  perfectionistPresets,
  prettierPresets,
  regexpOverrides,
  regexpPresets,
  sortPackageJson,
  sortTsconfig,
  typescriptOverrides,
  typescriptPresets,
} from './eslint-config/index.ts';
import {
  GLOB_DERIVED_DEPEND,
  GLOB_DERIVED_JS,
  GLOB_DERIVED_JSON,
} from './utils/index.ts';

const eslintConfig = defineConfig([
  /**
   * 全局忽略配置
   */
  { ...ignore({ root: true, files: ['.gitignore'] }), name: 'global:ignore' },

  /**
   * JS 派生文件预设配置
   */
  {
    name: 'derived-js:presets',
    files: [...GLOB_DERIVED_JS],
    extends: [
      builtinPresets,
      typescriptPresets,
      importPresets,
      regexpPresets,
      perfectionistPresets,
      prettierPresets,
    ],
  },

  /**
   * JS 派生文件覆盖配置
   */
  {
    name: 'derived-js:overrides',
    files: [...GLOB_DERIVED_JS],
    extends: [
      builtinOverrides,
      typescriptOverrides,
      importOverrides,
      regexpOverrides,
      perfectionistOverrides,
    ],
  },

  /**
   * JSON 派生文件预设配置
   */
  {
    name: 'derived-json:presets',
    files: [...GLOB_DERIVED_JSON],
    extends: [jsoncPresets],
  },

  /**
   * JSON 派生文件覆盖配置
   */
  {
    name: 'derived-json:overrides',
    files: [...GLOB_DERIVED_JSON],
    extends: [jsoncOverrides],
  },

  /**
   * 依赖项使用限制预设配置
   */
  {
    name: 'depend:presets',
    files: [...GLOB_DERIVED_DEPEND],
    extends: [dependPresets],
  },

  /**
   * 依赖项使用限制覆盖配置
   */
  {
    name: 'depend:overrides',
    files: [...GLOB_DERIVED_DEPEND],
    extends: [dependOverrides],
  },

  /**
   * 其他杂项覆盖配置
   */
  {
    name: 'misc:overrides',
    extends: [
      // 对 package.json 进行排序
      sortPackageJson,
      // 对 tsconfig.json 进行排序
      sortTsconfig,
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
  } satisfies Pick<ConfigWithExtends, 'extends' | 'name'>,
] satisfies SetRequired<ConfigWithExtends, 'name'>[]);

export default eslintConfig;
