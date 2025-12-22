/**
 * Perfectionist 配置设计理念
 *
 * ## 背景与动机
 *
 * Perfectionist 是一个极其严格的代码排序规范化插件，其全面性和强制性在社区中颇具争议。
 * 然而在团队协作场景下，统一的代码组织顺序能够：
 * - 显著减少代码审查中因排序差异引发的无意义讨论
 * - 降低合并冲突的发生频率和解决难度
 * - 消除「先写哪个后写哪个」的心智负担
 * - 建立可预测的代码阅读路径，提升整体可维护性
 *
 * 因此我们决定采用该插件，但需要在「自动化规范」与「开发者自主权」之间建立清晰的边界。
 *
 * ## 核心配置策略：类型优先，逻辑尊重
 *
 * 本配置遵循一条明确的分界线：**是否影响运行时逻辑**
 *
 * ### 原则一：类型系统与静态声明 → 自动排序
 *
 * 以下类别的代码元素**不影响程序运行时行为**，属于纯粹的「形式」而非「内容」：
 *
 * - **类型声明**（TypeScript 类型、接口、联合类型、交叉类型等）
 *   - 类型检查在编译时完成，成员顺序对类型系统无影响
 *   - 一致的类型组织提升可读性，便于快速定位
 *
 * - **导入/导出语句**
 *   - 模块解析机制保证执行顺序的正确性
 *   - 标准化分组使依赖关系一目了然
 *   - 是合并冲突的高发区，自动排序收益显著
 *
 * - **声明式标记语法**（如 JSX 属性）
 *   - 绝大多数场景下顺序不影响渲染结果
 *   - 遵循社区约定提升跨项目代码的一致性
 *
 * **设计理念**：这些元素的顺序本质上是「无语义的」，完全可以交由工具统一管理，
 * 将开发者从琐碎的格式化决策中解放出来。
 *
 * ### 原则二：运行时逻辑与语义结构 → 尊重开发者
 *
 * 以下类别的代码元素**承载开发者意图**或**影响程序行为**：
 *
 * - **对象字面量**
 *   - 属性顺序可能反映业务优先级或重要性层级
 *   - 某些场景下会影响遍历行为（Object.keys、序列化等）
 *
 * - **类成员组织**
 *   - 开发者通过成员顺序构建「代码叙事」
 *   - 公共 API 优先、相关方法聚合等具有强烈的设计意图
 *
 * - **数组与集合元素**
 *   - 顺序通常具有业务含义（优先级、执行顺序、显示顺序）
 *   - 重排可能导致逻辑错误
 *
 * - **语句与表达式顺序**
 *   - 涉及控制流和副作用，绝对不可自动重排
 *
 * **设计理念**：这些元素的组织蕴含开发者的深思熟虑，工具应该克制，
 * 避免用机械规则破坏人类智慧的表达。
 *
 * ## 预期价值
 *
 * 这种「有所为，有所不为」的配置策略带来：
 *
 * **效率提升**
 * - 代码审查聚焦业务逻辑，而非格式争议
 * - 减少 70%+ 的导入语句合并冲突
 * - 新成员快速适应一致的代码组织模式
 *
 * **质量保障**
 * - 类型定义的一致性降低理解门槛
 * - 可预测的代码结构减少认知负担
 * - 自动化保障降低人为疏漏
 *
 * **团队和谐**
 * - 消除「代码排序」类的主观偏好争执
 * - 建立基于原则而非个人习惯的共识
 *
 * ## 实施考量
 *
 * **接受的成本**
 * - 团队需要一定的适应期
 * - 依赖编辑器集成和 CI 检查基础设施
 * - 极少数边缘场景需要临时禁用规则
 *
 * **不接受的成本**
 * - 牺牲代码语义表达能力
 * - 对运行时逻辑进行侵入式重排
 * - 将工具便利性置于代码可读性之上
 *
 * ## 小结
 *
 * Perfectionist 是一把双刃剑。我们选择在「类型系统与静态声明」领域充分发挥其
 * 自动化优势，同时在「运行时逻辑与语义结构」领域坚守开发者的主导权。
 *
 * 这不是妥协，而是在工程效率与代码表达力之间找到的平衡点。
 */

import { defineConfig } from 'eslint/config';

type Group = string | { newlinesBetween: number };

/**
 * Unknown 组守卫配置
 *
 * @description
 * 通过设置异常的换行数量作为哨兵值，当有元素未被正确分类而
 * 落入 unknown 组时，将产生与 Prettier 格式化规范的冲突，以此作为
 * 视觉提示，提醒开发者完善自定义分组配置
 *
 * @reason
 * - 利用格式化冲突作为主动告警机制，而非被动发现分类遗漏
 */
const UNKNOWN_GROUP_GUARD = [{ newlinesBetween: 3 }, 'unknown'];

const createNamedImportsExportsGroups = (
  type: 'export' | 'import',
): Group[] => [`value-${type}`, `type-${type}`, ...UNKNOWN_GROUP_GUARD];

const createUnionIntersectionTypesGroups = (): Group[] => [
  'nullish',
  'keyword',
  'literal',
  'operator',
  'named',
  'import',
  'tuple',
  'object',
  'function',
  'intersection',
  'union',
  'conditional',
  ...UNKNOWN_GROUP_GUARD,
];

const createInterfacesObjectTypesGroups = (): Group[] => [
  'required-property',
  'multiline-required-property',
  'required-method',
  'multiline-required-method',
  'optional-property',
  'multiline-optional-property',
  'optional-method',
  'multiline-optional-method',
  'index-signature',
  ...UNKNOWN_GROUP_GUARD,
];

const perfectionistOverrides = defineConfig([
  {
    name: 'perfectionist:conflicting-rules',
    // @perfectionist-sort-objects
    rules: { 'import-x/order': 'off', 'sort-imports': 'off' },
  },
  {
    name: 'perfectionist:overrides',
    // @perfectionist-sort-objects
    rules: {
      /**
       * 导入语句排序
       *
       * @reason
       * - 降低代码审查和合并冲突的认知负担，避免因顺序差异引发无意义的讨论
       */
      'perfectionist/sort-imports': [
        'warn',
        {
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
            ...UNKNOWN_GROUP_GUARD,
          ],
          newlinesBetween: 1,
        },
      ],
      /**
       * TypeScript 接口属性排序
       *
       * @reason
       * - 降低代码审查和合并冲突的认知负担，避免因顺序差异引发无意义的讨论
       */
      'perfectionist/sort-interfaces': [
        'warn',
        { groups: createInterfacesObjectTypesGroups() },
      ],
      /**
       * 交叉类型成员排序
       *
       * @reason
       * - 降低代码审查和合并冲突的认知负担，避免因顺序差异引发无意义的讨论
       */
      'perfectionist/sort-intersection-types': [
        'warn',
        { groups: createUnionIntersectionTypesGroups() },
      ],
      /**
       * JSX 属性排序规范
       *
       * @reason
       * - 降低代码审查和合并冲突的认知负担，避免因顺序差异引发无意义的讨论
       */
      'perfectionist/sort-jsx-props': [
        'warn',
        {
          customGroups: [
            { elementNamePattern: '^key$', groupName: 'key' },
            { elementNamePattern: '^ref$', groupName: 'ref' },
            { elementNamePattern: '^id$', groupName: 'id' },
            { elementNamePattern: '^className$', groupName: 'className' },
            { elementNamePattern: '^style$', groupName: 'style' },
            { elementNamePattern: '^data-.*$', groupName: 'data-attribute' },
            { elementNamePattern: '^aria-.*$', groupName: 'aria-attribute' },
            { elementNamePattern: '^on[A-Z].*$', groupName: 'callback' },
          ],
          groups: [
            'key',
            'ref',
            'id',
            'className',
            'style',
            'data-attribute',
            'aria-attribute',
            'shorthand-prop',
            'prop',
            'multiline-prop',
            'callback',
            ...UNKNOWN_GROUP_GUARD,
          ],
        },
      ],
      /**
       * 强制模块成员排序
       *
       * @reason
       * - 降低代码审查和合并冲突的认知负担，避免因顺序差异引发无意义的讨论
       */
      'perfectionist/sort-modules': 'warn',
      /**
       * 具名导出排序规则
       *
       * @reason
       * - 降低代码审查和合并冲突的认知负担，避免因顺序差异引发无意义的讨论
       */
      'perfectionist/sort-named-exports': [
        'warn',
        { groups: createNamedImportsExportsGroups('export') },
      ],
      /**
       * 具名导入排序规则
       *
       * @reason
       * - 降低代码审查和合并冲突的认知负担，避免因顺序差异引发无意义的讨论
       */
      'perfectionist/sort-named-imports': [
        'warn',
        { groups: createNamedImportsExportsGroups('import') },
      ],
      /**
       * 强制对象类型的排序
       *
       * @reason
       * - 降低代码审查和合并冲突的认知负担，避免因顺序差异引发无意义的讨论
       */
      'perfectionist/sort-object-types': [
        'warn',
        { groups: createInterfacesObjectTypesGroups() },
      ],
      /**
       * 对象键排序检查
       *
       * @reason
       * - 全局禁用自动排序，避免对所有对象字面量强制排序造成不必要的约束
       * - 对象属性顺序可能反映业务优先级或重要性层级，应尊重开发者的设计意图
       * - 通过 @perfectionist-sort-objects 注释在需要的地方手动启用，实现精准控制
       */
      'perfectionist/sort-objects': 'off',
      /**
       * 强制 switch 语句分支排序
       *
       * @reason
       * - 尊重开发者对代码结构的主导权
       */
      'perfectionist/sort-switch-case': 'off',
      /**
       * 联合类型成员排序
       *
       * @reason
       * - 降低代码审查和合并冲突的认知负担，避免因顺序差异引发无意义的讨论
       */
      'perfectionist/sort-union-types': [
        'warn',
        { groups: createUnionIntersectionTypesGroups() },
      ],
    },
  },
]);

export { perfectionistOverrides };
