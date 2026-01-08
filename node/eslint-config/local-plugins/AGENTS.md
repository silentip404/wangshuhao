# AGENTS Guidelines for This Directory or Its Children

This directory contains local ESLint plugins with custom rules. Rules are organized into namespace subdirectories (e.g., `miscellaneous/`) and registered via `setup.ts`.

---

## Rule Templates

When creating new ESLint rules in this directory, you **MUST** follow one of the two templates below based on whether the rule requires configuration options.

### Rules Without Options

For simple rules that do not accept user configuration:

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

### Rules With Options

For rules that accept configuration options via schema:

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

## Rule Registration

After creating a new rule, you **MUST** register it in `setup.ts` by:

1. Importing the rule from the appropriate namespace exports file (e.g., `miscellaneous/exports.ts`)
2. Adding the rule to the corresponding plugin's `rules` object
