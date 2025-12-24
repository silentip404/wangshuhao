import { defineConfig } from 'eslint/config';
import type { SetRequired } from 'type-fest';
import type { ConfigWithExtends } from 'typescript-eslint';

import {
  builtinOverrides,
  builtinPresets,
  checkFileOverrides,
  checkFilePresets,
  commandPresets,
  dependOverrides,
  dependPresets,
  ignorePresets,
  importXOverrides,
  importXPresets,
  jsoncOverrides,
  jsoncPresets,
  jsxA11yPresets,
  localOverrides,
  localPresets,
  nextPresets,
  perfectionistOverrides,
  perfectionistPresets,
  prettierPresets,
  reactHooksPresets,
  reactOverrides,
  reactPresets,
  regexpOverrides,
  regexpPresets,
  sortPackageJson,
  sortTsconfig,
  typescriptOverrides,
  typescriptPresets,
} from './eslint-config/index.ts';
import {
  GLOB_ALL,
  GLOB_DERIVED_DEPEND,
  GLOB_DERIVED_JS,
  GLOB_DERIVED_JSON,
} from './utils/index.ts';

const eslintConfig = defineConfig([
  /**
   * 全局忽略配置
   */
  { name: 'global:ignore', extends: [ignorePresets] },

  /**
   * 强制执行对文件名和目录结构的检查
   */
  {
    name: 'global:check-file',
    files: [GLOB_ALL],
    extends: [checkFilePresets, checkFileOverrides],
  },
  {
    name: 'global:check-file-processor',
    files: [GLOB_ALL],
    ignores: [...GLOB_DERIVED_JS, ...GLOB_DERIVED_JSON],
    processor: 'check-file/eslint-processor-check-file',
  },

  /**
   * 基于特殊注释按需触发的 lint 工具
   */
  { name: 'command:presets', extends: [commandPresets] },

  /**
   * JS 派生文件预设配置
   */
  {
    name: 'derived-js:presets',
    files: [...GLOB_DERIVED_JS],
    extends: [
      builtinPresets,
      typescriptPresets,
      importXPresets,
      reactPresets,
      reactHooksPresets,
      jsxA11yPresets,
      nextPresets,
      regexpPresets,
      perfectionistPresets,
      prettierPresets,
      localPresets,
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
      importXOverrides,
      reactOverrides,
      regexpOverrides,
      perfectionistOverrides,
      localOverrides,
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
      // 约定俗成的文件不进行文件命名检查
      {
        files: ['**/{LICENSE,README.md}'],
        rules: { 'check-file/filename-naming-convention': 'off' },
      },
      // 约定俗成的文件夹不进行文件夹命名检查
      {
        files: ['**/{.husky,.vscode}/**'],
        rules: { 'check-file/folder-naming-convention': 'off' },
      },
      // 对 package.json 进行排序
      sortPackageJson,
      // 对 tsconfig.json 进行排序
      sortTsconfig,
      // 允许使用 Node.js 内置模块的特例
      {
        files: ['*.config.{,*.}{js,ts}', '{scripts,utils}/**/*.ts'],
        rules: { 'import-x/no-nodejs-modules': 'off' },
      },

      // 允许使用默认导出的特例
      {
        files: ['*.config.{,*.}{js,ts}', 'app/**/{layout,page}.tsx'],
        rules: { 'import-x/no-default-export': 'off' },
      },
    ],
  } satisfies Pick<ConfigWithExtends, 'extends' | 'name'>,
] satisfies SetRequired<ConfigWithExtends, 'name'>[]);

export default eslintConfig;
