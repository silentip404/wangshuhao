# 此目录及其子目录的 AGENTS 指南

此目录包含通过 Node.js 类型剥离直接执行的独立 TypeScript 脚本。每个脚本都有特定用途，例如验证、CLI 工具或自动化任务。

---

## 脚本模板

在此目录中创建新脚本时，**必须** 根据脚本是否需要命令行参数，遵循以下两个模板之一。

### 无命令行参数的脚本

适用于不需要用户输入的简单脚本：

```ts
import path from 'node:path';

import { parse as parseArguments } from 'ts-command-line-args';

import { helpArgumentConfig, helpArgumentOptions } from './utilities.ts';
import type { WithHelpArgument } from './utilities.ts';

type CliArguments = WithHelpArgument<Record<never, never>>;

parseArguments<CliArguments>(
  {
    ...helpArgumentConfig,
  },
  {
    ...helpArgumentOptions,

    headerContentSections: [
      {
        header: path.basename(import.meta.url),
        content: 'This is the tool description.',
      },
    ],
  },
);
```

### 有命令行参数的脚本

适用于接受命令行参数的脚本：

```ts
import path from 'node:path';

import { omit } from 'remeda';
import { parse as parseArguments } from 'ts-command-line-args';

import type { WithHelpArgument } from './utilities.ts';
import { helpArgumentConfig, helpArgumentOptions } from './utilities.ts';

type CliArguments = WithHelpArgument<{
  argument?: string;
}>;

const cliArguments = parseArguments<CliArguments>(
  {
    ...helpArgumentConfig,

    argument: {
      type: String,
      optional: true,
      description: 'This is the argument description.',
    },
  },
  {
    ...helpArgumentOptions,

    headerContentSections: [
      {
        header: path.basename(import.meta.url),
        content: 'This is the tool description.',
      },
    ],
  },
);

const options = omit(cliArguments, ['help']);

const { argument } = options;
```
