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
  eslintCommentsOverrides,
  eslintCommentsPresets,
  ignorePresets,
  importXOverrides,
  importXPresets,
  jsoncOverrides,
  jsoncPresets,
  jsxA11yPresets,
  localOverrides,
  localPresets,
  nextOverrides,
  nextPresets,
  perfectionistOverrides,
  perfectionistPresets,
  prettierOverrides,
  reactHooksPresets,
  reactOverrides,
  reactPresets,
  regexpOverrides,
  regexpPresets,
  sortPackageJson,
  sortTsconfig,
  stylisticOverrides,
  stylisticPresets,
  typescriptOverrides,
  typescriptPresets,
  unicornPresets,
} from '#node/eslint-config/index.ts';
import {
  GLOB_ALL,
  GLOB_CONFIG_FILES,
  GLOB_DERIVED_DEPEND,
  GLOB_DERIVED_JS,
  GLOB_DERIVED_JSON,
  GLOB_DOT_FILES,
  GLOB_EXTERNAL_TYPES,
  GLOB_FILES_IN_DOT_DIRECTORIES,
  GLOB_TSCONFIG_NODE_INCLUDE,
  toCaseInsensitiveGlob,
} from '#node/utilities/index.ts';

const eslintConfig = defineConfig([
  /**
   * 全局忽略配置
   */
  { name: 'global:ignore', extends: [ignorePresets] },

  /**
   * 强制执行对文件名和目录进行检查
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
      eslintCommentsPresets,
      builtinPresets,
      typescriptPresets,
      importXPresets,
      reactPresets,
      reactHooksPresets,
      jsxA11yPresets,
      nextPresets,
      regexpPresets,
      unicornPresets,
      stylisticPresets,
      perfectionistPresets,
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
      eslintCommentsOverrides,
      builtinOverrides,
      typescriptOverrides,
      importXOverrides,
      reactOverrides,
      nextOverrides,
      regexpOverrides,
      stylisticOverrides,
      perfectionistOverrides,
      localOverrides,
      prettierOverrides,
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

      // 允许使用默认导出的特例
      {
        files: [
          ...GLOB_EXTERNAL_TYPES,
          ...GLOB_CONFIG_FILES,
          'app/**/{layout,page}.tsx',
        ],
        rules: { 'import-x/no-default-export': 'off' },
      },

      // 纯 Node.js 环境特例
      {
        files: [...GLOB_TSCONFIG_NODE_INCLUDE],
        rules: {
          'import-x/no-nodejs-modules': 'off',
          'regexp/no-super-linear-move': 'off',
          'unicorn/no-process-exit': 'off',
        },
      },

      // 需要保持大写的文件名
      {
        files: [
          `**/${toCaseInsensitiveGlob('LICENSE')}`,
          `**/${toCaseInsensitiveGlob('{README,CHANGELOG}')}.md`,
        ],
        rules: {
          'check-file/filename-naming-convention': [
            'error',
            { [GLOB_ALL]: '[A-Z]+' },
            { ignoreMiddleExtensions: false },
          ],
        },
      },

      // 关闭文件命名检查的特例
      {
        files: [GLOB_DOT_FILES],
        rules: { 'check-file/filename-naming-convention': 'off' },
      },

      // 关闭文件夹命名检查的特例
      {
        files: [...GLOB_EXTERNAL_TYPES, GLOB_FILES_IN_DOT_DIRECTORIES],
        rules: { 'check-file/folder-naming-convention': 'off' },
      },
    ],
  } satisfies Pick<ConfigWithExtends, 'extends' | 'name'>,
] satisfies SetRequired<ConfigWithExtends, 'name'>[]);

export default eslintConfig;
