import { defineConfig } from 'eslint/config';
import type { SetRequired } from 'type-fest';
import type { ConfigWithExtends } from 'typescript-eslint';

import { commandSetup } from '#node/eslint-config/command/setup.ts';
import { localPluginsSetup } from '#node/eslint-config/local-plugins/setup.ts';
import { builtinOverrides } from '#node/eslint-config/overrides/builtin.ts';
import { checkFileOverrides } from '#node/eslint-config/overrides/check-file.ts';
import { dependOverrides } from '#node/eslint-config/overrides/depend.ts';
import { eslintCommentsOverrides } from '#node/eslint-config/overrides/eslint-comments.ts';
import { importXOverrides } from '#node/eslint-config/overrides/import-x.ts';
import { jsoncOverrides } from '#node/eslint-config/overrides/jsonc.ts';
import { localOverrides } from '#node/eslint-config/overrides/local.ts';
import { nextOverrides } from '#node/eslint-config/overrides/next.ts';
import { perfectionistOverrides } from '#node/eslint-config/overrides/perfectionist.ts';
import { prettierOverrides } from '#node/eslint-config/overrides/prettier.ts';
import { reactOverrides } from '#node/eslint-config/overrides/react.ts';
import { regexpOverrides } from '#node/eslint-config/overrides/regexp.ts';
import {
  sortPackageJson,
  sortTsconfig,
} from '#node/eslint-config/overrides/sort-json.ts';
import { stylisticOverrides } from '#node/eslint-config/overrides/stylistic.ts';
import { typescriptOverrides } from '#node/eslint-config/overrides/typescript.ts';
import { unicornOverrides } from '#node/eslint-config/overrides/unicorn.ts';
import { builtinPresets } from '#node/eslint-config/presets/builtin.ts';
import { checkFilePresets } from '#node/eslint-config/presets/check-file.ts';
import { dependPresets } from '#node/eslint-config/presets/depend.ts';
import { eslintCommentsPresets } from '#node/eslint-config/presets/eslint-comments.ts';
import { ignorePresets } from '#node/eslint-config/presets/ignore.ts';
import { importXPresets } from '#node/eslint-config/presets/import-x.ts';
import { jsoncPresets } from '#node/eslint-config/presets/jsonc.ts';
import { jsxA11yPresets } from '#node/eslint-config/presets/jsx-a11y.ts';
import { nextPresets } from '#node/eslint-config/presets/next.ts';
import { perfectionistPresets } from '#node/eslint-config/presets/perfectionist.ts';
import { reactHooksPresets } from '#node/eslint-config/presets/react-hooks.ts';
import { reactPresets } from '#node/eslint-config/presets/react.ts';
import { regexpPresets } from '#node/eslint-config/presets/regexp.ts';
import { stylisticPresets } from '#node/eslint-config/presets/stylistic.ts';
import { typescriptPresets } from '#node/eslint-config/presets/typescript.ts';
import { unicornPresets } from '#node/eslint-config/presets/unicorn.ts';
import {
  GLOB_ALL,
  GLOB_COMBINED_DEPENDENCY_SOURCES,
  GLOB_COMBINED_JS,
  GLOB_COMBINED_JSON,
  GLOB_CONFIG_FILES,
  GLOB_DOT_FILES,
  GLOB_EXTERNAL_TYPE_DECLARATIONS,
  GLOB_FILES_IN_DOT_DIRECTORY,
  GLOB_SCRIPTS_FILES,
  GLOB_TSCONFIG_NODE_INCLUDE,
  toCaseInsensitiveGlob,
} from '#node/utilities/globs.ts';

const eslintConfig = defineConfig([
  /**
   * 全局忽略配置
   */
  {
    name: 'global-ignore',
    extends: ignorePresets,
  },

  /**
   * 强制执行对文件名和目录进行检查
   */
  {
    name: 'check-file',
    files: [GLOB_ALL],
    extends: [checkFilePresets, checkFileOverrides],
  },
  {
    name: 'check-file:processor',
    files: [GLOB_ALL],
    ignores: [...GLOB_COMBINED_JS, ...GLOB_COMBINED_JSON],
    processor: 'check-file/eslint-processor-check-file',
  },

  /**
   * 基于特殊注释按需触发的 lint 工具
   */
  {
    name: 'command:setup',
    files: [...GLOB_COMBINED_JS],
    extends: commandSetup,
  },

  /**
   * 本地插件安装
   */
  {
    name: 'local-plugins:setup',
    files: [...GLOB_COMBINED_JS],
    extends: localPluginsSetup,
  },

  /**
   * JS 相关文件配置
   */
  {
    name: 'combined-js',
    files: [...GLOB_COMBINED_JS],
    extends: [
      // 预设配置
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

      // 覆盖配置
      prettierOverrides,
      eslintCommentsOverrides,
      builtinOverrides,
      typescriptOverrides,
      importXOverrides,
      reactOverrides,
      nextOverrides,
      regexpOverrides,
      unicornOverrides,
      stylisticOverrides,
      perfectionistOverrides,
      localOverrides,
    ],
  },

  /**
   * JSON 相关文件配置
   */
  {
    name: 'combined-json',
    files: [...GLOB_COMBINED_JSON],
    extends: [jsoncPresets, jsoncOverrides],
  },

  /**
   * 依赖项使用限制
   */
  {
    name: 'depend',
    files: [...GLOB_COMBINED_DEPENDENCY_SOURCES],
    extends: [dependPresets, dependOverrides],
  },

  /**
   * 其他杂项覆盖配置
   */
  {
    name: 'miscellaneous:overrides',
    extends: [
      // Node.js 环境特例
      {
        files: [...GLOB_TSCONFIG_NODE_INCLUDE],
        rules: {
          'import-x/no-nodejs-modules': 'off',
          'regexp/no-super-linear-move': 'off',
        },
      },

      // 配置文件特例
      {
        files: [...GLOB_CONFIG_FILES],
        rules: {
          'import-x/max-dependencies': 'off',
        },
      },

      // Node.js 脚本特例
      {
        files: [GLOB_SCRIPTS_FILES],
        rules: {
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
            {
              [GLOB_ALL]: '[A-Z]+',
            },
            {
              ignoreMiddleExtensions: false,
            },
          ],
        },
      },

      // 关闭文件命名检查的特例
      {
        files: [GLOB_DOT_FILES],
        rules: {
          'check-file/filename-naming-convention': 'off',
        },
      },

      // 关闭文件夹命名检查的特例
      {
        files: [GLOB_EXTERNAL_TYPE_DECLARATIONS, GLOB_FILES_IN_DOT_DIRECTORY],
        rules: {
          'check-file/folder-naming-convention': 'off',
        },
      },

      // 允许使用默认导出的特例
      {
        files: [
          GLOB_EXTERNAL_TYPE_DECLARATIONS,
          ...GLOB_CONFIG_FILES,
          'app/**/{layout,page}.tsx',
        ],
        rules: {
          'import-x/no-default-export': 'off',
        },
      },

      // 对 package.json 进行排序
      sortPackageJson,

      // 对 tsconfig.json 进行排序
      sortTsconfig,
    ],
  } satisfies Pick<ConfigWithExtends, 'extends' | 'name'>,
] satisfies SetRequired<ConfigWithExtends, 'name'>[]);

export default eslintConfig;
