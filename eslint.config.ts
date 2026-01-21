import { defineConfig } from 'eslint/config';
import type { ConfigWithExtends } from 'typescript-eslint';

import { commandSetup } from '#node/eslint-config/command/setup.ts';
import { localSetup } from '#node/eslint-config/local-plugins/setup.ts';
import { builtinOverrides } from '#node/eslint-config/overrides/builtin.ts';
import { checkFileOverrides } from '#node/eslint-config/overrides/check-file.ts';
import { dependOverrides } from '#node/eslint-config/overrides/depend.ts';
import { eslintCommentsOverrides } from '#node/eslint-config/overrides/eslint-comments.ts';
import { importXOverrides } from '#node/eslint-config/overrides/import-x.ts';
import { jsdocOverrides } from '#node/eslint-config/overrides/jsdoc.ts';
import { jsoncOverrides } from '#node/eslint-config/overrides/jsonc.ts';
import { localOverrides } from '#node/eslint-config/overrides/local.ts';
import { perfectionistOverrides } from '#node/eslint-config/overrides/perfectionist.ts';
import { prettierOverrides } from '#node/eslint-config/overrides/prettier.ts';
import { regexpOverrides } from '#node/eslint-config/overrides/regexp.ts';
import {
  sortPackageJson,
  sortTsconfigJson,
} from '#node/eslint-config/overrides/sort-json.ts';
import { stylisticOverrides } from '#node/eslint-config/overrides/stylistic.ts';
import { tsdocOverrides } from '#node/eslint-config/overrides/tsdoc.ts';
import { typescriptOverrides } from '#node/eslint-config/overrides/typescript.ts';
import { unicornOverrides } from '#node/eslint-config/overrides/unicorn.ts';
import { builtinSetup } from '#node/eslint-config/setups/builtin.ts';
import { checkFileSetup } from '#node/eslint-config/setups/check-file.ts';
import { dependSetup } from '#node/eslint-config/setups/depend.ts';
import { eslintCommentsSetup } from '#node/eslint-config/setups/eslint-comments.ts';
import { ignoreSetup } from '#node/eslint-config/setups/ignore.ts';
import { importAliasSetup } from '#node/eslint-config/setups/import-alias.ts';
import { importXSetup } from '#node/eslint-config/setups/import-x.ts';
import { jsdocSetup } from '#node/eslint-config/setups/jsdoc.ts';
import { jsoncSetup } from '#node/eslint-config/setups/jsonc.ts';
import { jsxA11ySetup } from '#node/eslint-config/setups/jsx-a11y.ts';
import { nextSetup } from '#node/eslint-config/setups/next.ts';
import { perfectionistSetup } from '#node/eslint-config/setups/perfectionist.ts';
import { reactHooksSetup } from '#node/eslint-config/setups/react-hooks.ts';
import { reactSetup } from '#node/eslint-config/setups/react.ts';
import { regexpSetup } from '#node/eslint-config/setups/regexp.ts';
import { stylisticSetup } from '#node/eslint-config/setups/stylistic.ts';
import { tsdocSetup } from '#node/eslint-config/setups/tsdoc.ts';
import { typescriptSetup } from '#node/eslint-config/setups/typescript.ts';
import { unicornSetup } from '#node/eslint-config/setups/unicorn.ts';
import {
  GLOB_ALL,
  GLOB_DOT_FILES,
  GLOB_FILES_IN_DOT_DIRECTORY,
  GLOB_JS,
  GLOB_JSX,
  GLOB_SCRIPTS_FILES,
  GLOB_TYPINGS,
  GLOBS_CONFIG_FILES,
  GLOBS_TSCONFIG_NODE_INCLUDE,
  toCaseInsensitiveGlob,
} from '#node/utilities/globs.ts';

type NamedExtendedConfig = Required<
  Pick<ConfigWithExtends, 'extends' | 'name'>
>;

const eslintConfig = defineConfig([
  {
    name: 'setups',
    extends: [
      // 基础设施
      ignoreSetup,
      commandSetup,

      // 语言核心
      builtinSetup,
      typescriptSetup,

      // 框架规则
      reactSetup,
      reactHooksSetup,
      jsxA11ySetup,
      nextSetup,

      // 代码质量
      dependSetup,
      importXSetup,
      importAliasSetup,
      regexpSetup,
      unicornSetup,
      eslintCommentsSetup,

      // 代码注释
      jsdocSetup,
      tsdocSetup,

      // 代码风格
      stylisticSetup,
      perfectionistSetup,

      // 特殊文件
      checkFileSetup,
      jsoncSetup,

      // 本地插件
      localSetup,
    ],
  },

  {
    name: 'overrides',
    extends: [
      // 语言核心
      builtinOverrides,
      typescriptOverrides,

      // 代码质量
      dependOverrides,
      importXOverrides,
      regexpOverrides,
      unicornOverrides,
      eslintCommentsOverrides,

      // 代码注释
      jsdocOverrides,
      tsdocOverrides,

      // 代码风格
      prettierOverrides,
      stylisticOverrides,
      perfectionistOverrides,

      // 特殊文件
      checkFileOverrides,
      jsoncOverrides,

      // 本地插件
      localOverrides,
    ],
  },

  {
    name: 'miscellaneous-overrides',
    extends: [
      sortPackageJson,

      sortTsconfigJson,

      /**
       * 允许导入内置模块
       */
      {
        rules: {
          'import-x/no-nodejs-modules': 'off',
        },
        files: [...GLOBS_TSCONFIG_NODE_INCLUDE],
      },

      /**
       * 允许拥有更多的依赖项
       */
      {
        rules: {
          'import-x/max-dependencies': 'off',
        },
        files: [...GLOBS_CONFIG_FILES],
      },

      /**
       * 允许使用默认导出
       */
      {
        rules: {
          'import-x/no-default-export': 'off',
        },
        files: [
          GLOB_TYPINGS,
          ...GLOBS_CONFIG_FILES,
          'app/**/{layout,page}.tsx',
        ],
      },

      /**
       * 允许使用可能导致超线性回溯的正则表达式
       */
      {
        rules: {
          'regexp/no-super-linear-move': 'off',
        },
        files: [...GLOBS_TSCONFIG_NODE_INCLUDE],
      },

      /**
       * 允许调用 process.exit() 方法
       */
      {
        rules: {
          'unicorn/no-process-exit': 'off',
        },
        files: [GLOB_SCRIPTS_FILES],
      },

      /**
       * 关闭 tsdoc 语法检查
       */
      {
        rules: {
          'tsdoc/syntax': 'off',
        },
        files: [GLOB_JS, GLOB_JSX],
      },

      /**
       * 强制使用全大写文件名
       */
      {
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
        files: [
          `**/${toCaseInsensitiveGlob('LICENSE')}`,
          `**/${toCaseInsensitiveGlob('{AGENTS,README,CHANGELOG}')}.md`,
        ],
      },

      /**
       * 关闭文件命名检查
       */
      {
        rules: {
          'check-file/filename-naming-convention': 'off',
        },
        files: [GLOB_DOT_FILES],
      },

      /**
       * 关闭文件夹命名检查
       */
      {
        rules: {
          'check-file/folder-naming-convention': 'off',
        },
        files: [GLOB_TYPINGS, GLOB_FILES_IN_DOT_DIRECTORY],
      },
    ],
  },
] satisfies NamedExtendedConfig[]);

export default eslintConfig;
