import { defineConfig } from 'eslint/config';

const reactOverrides = defineConfig([
  {
    name: 'react:related-non-react-overrides',
    rules: {
      /**
       * 函数最大行数控制
       *
       * @reason
       * - React 组件通常包含 JSX、事件处理、状态逻辑、副作用等多种关注点，声明式结构天然较长
       * - 使用 complexity 和 max-depth 等规则更适合度量组件复杂度，避免行数规则对声明式代码的误判
       */
      'max-lines-per-function': 'off',
    },
  },
  {
    name: 'react:react-overrides',
    rules: {
      /**
       * JSX 文件扩展名控制
       *
       * @reason
       * - TypeScript 项目中 `.tsx` 是包含 JSX 的标准扩展名，`.ts` 用于纯 TypeScript 代码
       * - 代码审查时扩展名变化能直观反映文件内容的变更
       * - 明确的文件扩展名有助于开发者和 AI 理解文件用途
       */
      'react/jsx-filename-extension': [
        'error',
        { extensions: ['.tsx'], allow: 'as-needed' },
      ],
      /**
       * JSX 嵌套深度控制
       *
       * @reason
       * - 限制嵌套深度促使开发者遵循组件单一职责原则
       * - 浅层组件树更易于理解代码结构和进行代码重构
       */
      'react/jsx-max-depth': ['warn', { max: 5 }],
      /**
       * 组件 props 使用检查
       *
       * @reason
       * - 防止样式逻辑通过 className 和 style 泄漏到组件接口，维护组件封装性
       * - 强制组件通过语义化 props 暴露定制能力，提升 API 可维护性
       */
      'react/forbid-component-props': 'warn',
      /**
       * JSX props 排序规则检查
       *
       * @reason
       * - 统一的属性顺序降低代码审查和维护时的认知负荷
       * - 在多人协作和 AI 辅助编程场景下保持代码风格一致性
       */
      'react/jsx-sort-props': [
        'warn',
        {
          ignoreCase: false,
          reservedFirst: true,
          shorthandFirst: true,
          callbacksLast: true,
          multiline: 'last',
        },
      ],
    },
  },
]);

export { reactOverrides };
