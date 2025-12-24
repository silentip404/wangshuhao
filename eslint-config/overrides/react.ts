import { defineConfig } from 'eslint/config';

const reactOverrides = defineConfig([
  {
    name: 'react:overrides',
    // @perfectionist-sort-objects
    rules: {
      /**
       * 文件命名检查
       *
       * @reason
       * - 统一由 check-file 插件集中管理所有文件命名检查，避免多个插件规则冲突
       */
      '@eslint-react/naming-convention/filename': 'off',
    },
  },
]);

export { reactOverrides };
