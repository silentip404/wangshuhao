import { defineConfig } from 'eslint/config';

import { ensureDependenciesInPackage } from '#node/utils';

const dependOverrides = defineConfig([
  {
    name: 'depend:overrides',
    // @perfectionist-sort-objects
    rules: {
      /**
       * 依赖项使用限制
       *
       * @reason
       * - 禁止微型工具库减少依赖膨胀，降低供应链攻击风险
       * - 禁止与原生功能重复的包，充分利用现代 Node.js 能力，减少打包体积
       * - 引导团队优先选择维护良好的轻量级替代方案，提升项目长期可维护性
       */
      'depend/ban-dependencies': [
        'error',
        {
          allowed: ensureDependenciesInPackage([
            /**
             * 目前 lint-staged 维护积极，且 TypeScript 类型支持友好
             *
             * - 目前 nano-staged 不支持 typescript 配置文件
             *
             * @see https://github.com/es-tooling/module-replacements/blob/main/docs/modules/lint-staged.md
             */
            'lint-staged',
            /**
             * 目前 eslint-plugin-import 维护积极，且 TypeScript 类型支持友好
             *
             * - 目前 eslint-plugin-import-x 与 eslint/config 提供的 defineConfig 方法类型不兼容
             *
             * @see https://github.com/es-tooling/module-replacements/blob/main/docs/modules/eslint-plugin-import.md
             */
            'eslint-plugin-import',
            /**
             * 目前 execa 维护积极，且 TypeScript 类型支持友好
             *
             * - knip 尚未适配 tinyexec
             * - knip 尚未适配 nanoexec
             * - 项目暂不考虑切换到 Bun
             *
             * @see https://github.com/es-tooling/module-replacements/blob/main/docs/modules/execa.md
             */
            'execa',
          ]),
        },
      ],
    },
  },
]);

export { dependOverrides };
