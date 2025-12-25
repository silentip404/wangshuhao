import { defineConfig } from 'eslint/config';

import { ensureModulePathsInPackage } from '#node/utils/index.ts';

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
          allowed: await ensureModulePathsInPackage([
            /**
             * 目前 lint-staged 维护积极，且 TypeScript 类型支持友好
             *
             * - 目前 nano-staged 不支持 typescript 配置文件
             *
             * @see https://github.com/es-tooling/module-replacements/blob/main/docs/modules/lint-staged.md
             */
            'lint-staged',
          ]),
        },
      ],
    },
  },
]);

export { dependOverrides };
