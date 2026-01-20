# 此目录及其子目录的 AGENTS 指南

此目录包含带有自定义规则的本地 ESLint 插件。规则按命名空间子目录组织（例如 `miscellaneous/`）并通过 `setup.ts` 注册。

---

## 规则模板

在此目录中创建新的 ESLint 规则时，**必须** 根据规则是否需要配置选项，遵循以下两个模板之一。

### 无选项的规则

适用于不接受用户配置的简单规则：

```ts
import { initRule } from '../utilities/rule.ts';

type MessageIds = 'message';

const { ruleName, createRule } = initRule(import.meta.url);

const ruleValue = createRule<never[], MessageIds>({
  name: ruleName,
  meta: {
    type: 'layout',
    fixable: undefined,
    schema: [],
    docs: {
      description: 'This is an example rule without options.',
    },
    messages: {
      message: 'This is an example error message.',
    },
  },
  defaultOptions: [],
  create: (context) => ({}),
});

export { ruleName, ruleValue };
```

### 有选项的规则

适用于通过 schema 接受配置选项的规则：

```ts
import { initRule } from '../utilities/rule.ts';
import type { InferSchema } from '../utilities/schema.ts';
import { createESLintSchema } from '../utilities/schema.ts';

type MessageIds = 'message';
type RuleOptions = InferSchema<typeof eslintSchema>[0];

const eslintSchema = createESLintSchema({
  type: 'object',
  additionalProperties: false,
  required: ['enumOption'],
  properties: {
    stringOption: {
      type: 'string',
    },
    enumOption: {
      type: 'string',
      enum: ['lower', 'upper'],
    },
  },
});

const { ruleName, createRule } = initRule(import.meta.url);

const ruleValue = createRule<[RuleOptions], MessageIds>({
  name: ruleName,
  meta: {
    type: 'layout',
    fixable: undefined,
    schema: eslintSchema,
    docs: {
      description: 'This is an example rule with options.',
    },
    messages: {
      message: 'This is an example error message.',
    },
  },
  defaultOptions: [
    {
      enumOption: 'lower',
    },
  ],
  create: (context, [ruleOptions]) => {
    const { stringOption, enumOption } = ruleOptions;

    return {};
  },
});

export { ruleName, ruleValue };
```

---

## 规则注册

创建新规则后，**必须** 在 `setup.ts` 中注册它，方法是：

1. 从相应的命名空间导出文件导入规则（例如 `miscellaneous/exports.ts`）
2. 将规则添加到相应插件的 `rules` 对象中
