# 此目录及其子目录的 AGENTS 指南

## 项目结构

本项目包含三个 TypeScript 子项目：`app`、`node` 和 `lib`。

- **app**: Next.js 应用，包含浏览器端和服务器端代码
- **node**: 直接在 Node.js 中通过内置类型剥离执行的 TypeScript 代码（无需转译），例如配置文件和脚本
- **lib**: `app` 和 `node` 共享的工具库。无需独立构建；由使用者按需编译（`app` 使用 Next.js 编译，`node` 使用 Node.js 类型剥离）

### 确定文件所属子项目

当无法从文件路径确定其所属子项目时，需要阅读 `tsconfig.json` 及引用的配置文件（`tsconfig.app.json`、`tsconfig.node.json`、`tsconfig.lib.json`），通过 `include` 模式来识别文件属于哪个子项目。

## TypeScript 类型安全

- **必须** 确保所有生成的代码没有 TypeScript 错误
- **禁止** 抑制任何 TypeScript 错误

## 使用 Zod 进行运行时类型验证

使用 Zod 进行运行时类型验证时，遵循以下约定：

| 子项目   | 方法           | 错误处理               |
| -------- | -------------- | ---------------------- |
| node     | `.parse()`     | 让验证错误抛出         |
| lib, app | `.safeParse()` | 显式处理验证失败的情况 |

## 处理不可避免的第三方类型问题

如果遇到确实无法避免的第三方类型兼容性问题：

- **必须** 在 `ts-expect-error.ts` 中按照现有结构记录原因
- **必须** 使用 `@ts-expect-error` 并遵循必需格式：`@ts-expect-error -- See reasons['<reason-key>'] in ts-expect-error.ts`
- **必须** 确保 reason key 与 `ts-expect-error.ts` 中定义的 key 匹配

## Linting 和格式化

- **应该** 忽略所有 Prettier 格式化问题；项目有自动化格式化
- **应该** 只处理 ESLint 报告的 error 级别问题；warnings 和其他严重级别 **应该** 被忽略
