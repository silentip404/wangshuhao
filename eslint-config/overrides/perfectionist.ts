import { defineConfig } from 'eslint/config';

const createNamedImportsExportsGroups = (
  type: 'export' | 'import',
): string[] => [`value-${type}`, `type-${type}`, 'unknown'];

const createUnionIntersectionTypesGroups = (): (string[] | string)[] => [
  'named',
  'keyword',
  'operator',
  'tuple',
  ['intersection', 'union'],
  'function',
  'conditional',
  'object',
  'import',
  'literal',
  'nullish',
  'unknown',
];

const perfectionistOverrides = defineConfig([
  {
    name: 'perfectionist:related-non-perfectionist-overrides',
    rules: {
      /**
       * 导入语句排序规则
       *
       * @reason
       * - 与 Perfectionist 插件的导入排序规则功能重叠，后者提供更精细的分组和排序控制
       * - 避免多个排序规则之间的冲突和不一致的自动修复行为
       * - 统一使用 Perfectionist 作为排序规范的单一来源，降低配置复杂度
       */
      'sort-imports': 'off',
      /**
       * 导入语句排序规则
       *
       * @reason
       * - 与 Perfectionist 插件的导入排序规则功能重叠，后者提供更精细的分组和排序控制
       * - 避免多个排序规则之间的冲突和不一致的自动修复行为
       * - 统一使用 Perfectionist 作为排序规范的单一来源，降低配置复杂度
       */
      'import/order': 'off',
    },
  },
  {
    name: 'perfectionist:perfectionist-overrides',
    rules: {
      /**
       * 具名导入排序规则
       *
       * @reason
       * - 标准化的导入顺序降低代码审查和合并冲突的认知负担
       * - 自动化的排序策略确保多人协作时的一致性，消除手动维护排序的时间成本
       */
      'perfectionist/sort-named-imports': [
        'warn',
        { groups: createNamedImportsExportsGroups('import') },
      ],
      /**
       * 具名导出排序规则
       *
       * @reason
       * - 标准化的导出顺序降低代码审查和合并冲突的认知负担
       * - 自动化的排序策略确保多人协作时的一致性，消除手动维护排序的时间成本
       */
      'perfectionist/sort-named-exports': [
        'warn',
        { groups: createNamedImportsExportsGroups('export') },
      ],
      /**
       * 联合类型成员排序
       *
       * @reason
       * - 一致的类型顺序提升代码可读性，便于快速定位和理解类型定义
       * - 标准化的类型排序降低代码审查时的认知负担，避免因顺序差异引发无意义的讨论
       */
      'perfectionist/sort-union-types': [
        'warn',
        { groups: createUnionIntersectionTypesGroups() },
      ],
      /**
       * 交叉类型成员排序
       *
       * @reason
       * - 一致的类型顺序提升代码可读性，便于快速定位和理解类型定义
       * - 标准化的类型排序降低代码审查时的认知负担，避免因顺序差异引发无意义的讨论
       */
      'perfectionist/sort-intersection-types': [
        'warn',
        { groups: createUnionIntersectionTypesGroups() },
      ],
      /**
       * TypeScript 接口属性排序
       *
       * @reason
       * - 一致的接口属性顺序提升代码可读性，便于快速定位和理解类型定义
       * - 标准化的类型排序降低代码审查时的认知负担，避免因顺序差异引发无意义的讨论
       */
      'perfectionist/sort-interfaces': [
        'warn',
        {
          partitionByNewLine: true,
          groups: [
            'required-property',
            'multiline-required-property',
            'required-method',
            'multiline-required-method',
            'optional-property',
            'multiline-optional-property',
            'optional-method',
            'multiline-optional-method',
            'index-signature',
            'unknown',
          ],
        },
      ],
      /**
       * JSX 属性排序规范
       *
       * @reason
       * - 统一的属性排序显著提升组件可读性和可维护性，尤其在大型组件场景下
       * - 符合 React 社区约定的属性组织顺序，降低团队协作的认知负担
       * - 预测性的属性组织减少人为错误，提升代码审查效率
       */
      'perfectionist/sort-jsx-props': [
        'warn',
        {
          groups: [
            'key',
            'ref',
            'id',
            'className',
            'style',
            'data-attribute',
            'aria-attribute',
            'shorthand-prop',
            'multiline-prop',
            'callback',
            'unknown',
          ],
          customGroups: [
            { groupName: 'key', elementNamePattern: '^key$' },
            { groupName: 'ref', elementNamePattern: '^ref$' },
            { groupName: 'id', elementNamePattern: '^id$' },
            { groupName: 'className', elementNamePattern: '^className$' },
            { groupName: 'style', elementNamePattern: '^style$' },
            { groupName: 'data-attribute', elementNamePattern: '^data-' },
            { groupName: 'aria-attribute', elementNamePattern: '^aria-' },
            { groupName: 'callback', elementNamePattern: '^on[A-Z].*' },
          ],
        },
      ],
      /**
       * 导入语句排序
       *
       * @reason
       * - 统一的导入顺序显著提升代码可读性和可维护性，使导入语句快速定位和扫描
       * - 明确的导入分组和排序规则减少合并冲突,促进团队协作
       */
      'perfectionist/sort-imports': [
        'warn',
        {
          newlinesBetween: 1,
          groups: [
            'builtin',
            'external',
            ['subpath', 'tsconfig-path', 'internal'],
            'parent',
            'sibling',
            'index',
            'style',
            'side-effect-style',
            'side-effect',
            'type',
            'unknown',
          ],
        },
      ],
    },
  },
]);

export { perfectionistOverrides };
