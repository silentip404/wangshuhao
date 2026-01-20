# Next.js 工程化模板（🚧开发中...）

> 目前作为面试作品持续迭代：以开源的 Next.js 模板为目标进行架构与开发，优先沉淀可复用的工程化能力与技术架构。等再次成为工作牛马后，将进一步适配英文开源标准。

## 为什么有此项目？

- **可验证的「活简历」**：可直接访问成品、查看源码与实现细节，用结果证明能力。
- **能力更可量化**：用可运行的项目与可审查的代码，替代简历里「熟悉 / 精通」这类主观表述。
- **端到端交付闭环**：覆盖设计、开发、部署上线，体现独立交付与问题解决能力。
- **技术深耕与复盘**：围绕性能优化、可访问性、工程化与 **DevOps** 持续实践，并记录技术决策与权衡。
- **降低沟通成本**：提供作品与代码链接，减少口头描述的不确定性，提升招聘沟通效率。

## 🏗️ 技术架构与功能特性

### 🤖 AI 辅助编程（🚧 进行中）

#### AGENTS 配置

项目使用 `AGENTS.md` 文件为 AI coding agents 提供项目特定的上下文和指令。

> 支持 Cursor、Codex CLI、GitHub Copilot 等主流 AI 编程工具读取此配置。

采用分层配置策略，根据目录层级提供不同粒度的指导：

| 文件                                         | 作用范围                                                |
| -------------------------------------------- | ------------------------------------------------------- |
| `AGENTS.md`                                  | 项目根目录：整体架构、TypeScript 类型安全、通用规范     |
| `node/eslint-config/local-plugins/AGENTS.md` | ESLint 插件开发：规则模板（有/无选项）、规则注册流程    |
| `node/scripts/AGENTS.md`                     | Node.js 脚本开发：脚本模板（有/无命令行参数）、执行约定 |

#### Cursor Skills

通过 **Cursor Skills** 配置上下文感知的 AI 技能，基于内置的 `create-skill` 技能重构，当 AI 执行特定任务时自动激活对应技能。

新版 Cursor 支持在聊天输入框中使用 `/` 直接调用技能，无需额外配置 Commands。

| 技能                     | 触发条件                                 | 说明                                                               |
| ------------------------ | ---------------------------------------- | ------------------------------------------------------------------ |
| `create-agents-md`       | 创建或更新 `AGENTS.md` 文件时            | 提供 AGENTS.md 的编写规范、推荐章节、monorepo 支持指导             |
| `create-commit-message`  | 生成 Git commit message 时               | 智能分析变更并生成符合项目 commitlint 规范的提交信息，支持范围检测 |
| `create-skill-overrides` | 创建或编写 `SKILL.md` 文件时（作为补充） | 扩展内置 `create-skill` 的编写规范，提供跨平台兼容性、格式约定等   |

### 💻 技术栈

- **框架**：**Next.js** 16
- **UI 库**：**React** 19
- **语言**：**TypeScript** 5
- **样式**：**Tailwind CSS** 4
- **代码检查**：**ESLint** 9（Flat Config）
- **代码格式化**：**Prettier** 3
- **Git 钩子管理**：**Husky** 9
- **提交信息规范**：**Commitlint** 20

### 🛠️ 工程化实践

> 状态标记：🚧 进行中 · ✅ 已完成 · 📋 待完成

- 🚧 **代码质量检查**：配置多插件 **ESLint** 和 **TypeScript** 类型检查，确保代码质量与规范一致性。
  - 集成 `typescript-eslint`、`eslint-plugin-import-x`、`@eslint-react/eslint-plugin`、`eslint-plugin-jsx-a11y`、`eslint-plugin-unicorn`、`eslint-plugin-perfectionist`、`@stylistic/eslint-plugin` 等插件
  - 配置 `eslint-plugin-check-file` 强制文件和目录命名规范
  - 配置 `eslint-plugin-jsonc` 对 **JSON/JSONC** 文件进行检查和排序
  - 通过 `tsc --build` 进行增量类型检查，提升检查效率

- 🚧 **工程化注释管理**：基于 `eslint-plugin-jsdoc`、`eslint-plugin-tsdoc` 和 AI 指导规则，构建多层级注释管理策略。
  - 使用 **JSDoc** 的 `flat/recommended-typescript` 配置，结合 **TSDoc** 语法检查，确保注释格式的标准化与可解析性
  - 在 `AGENTS.md` 和 AI 技能文件中编写注释指导规则，让 AI 代理生成符合项目上下文的高质量注释
  - 注释重点关注 "为什么" 和 "如何用"，而非重复类型系统已能表达的 "是什么"
  - 为 AI 辅助编程提供业务上下文，使生成代码更符合实际需求

- 🚧 **自定义 ESLint 规则**：开发项目专属的本地 **ESLint** 规则，满足特定的代码规范需求。

  | 规则名                                                     | 说明                                                             |
  | ---------------------------------------------------------- | ---------------------------------------------------------------- |
  | `@local/miscellaneous/module-identifier-naming-convention` | 强制模块默认导入和命名空间导入的标识符遵循基于模块路径的命名规范 |
  | `@local/miscellaneous/padding-line-before-process-exit`    | 强制 `process.exit()` 调用前有空行，提升程序终止点的视觉可识别性 |

- ✅ **自定义 ESLint 命令**：基于 `eslint-plugin-command` 开发的注释命令，通过特殊注释触发代码转换。

  | 命令名                        | 说明                                                                              |
  | ----------------------------- | --------------------------------------------------------------------------------- |
  | `@perfectionist-sort-objects` | 通过占位符机制对对象属性键进行自然排序，仅排序浅层属性键而不影响嵌套对象/数组内容 |

- ✅ **ESLint 配置验证**：通过独立的验证配置文件，确保 **ESLint** 配置的完整性，帮助识别遗漏的规则。
  - 创建 `eslint.config.audit.ts` 作为独立的验证配置文件，启用所有可用规则作为警告
  - 提供 `eslint:audit` 脚本运行验证配置，`eslint:audit:inspector` 脚本可视化查看配置结构
  - 验证过程显示所有被检测到的插件，帮助开发者了解配置的覆盖范围

- ✅ **环境统一**：强制锁定包管理器（**pnpm**）与 **Node.js** 版本，避免团队协作中的依赖异常与环境漂移。
  - 在 `package.json` 的 `scripts.preinstall` 中配置 `npx only-allow pnpm`，限制项目仅可使用 **pnpm**
  - 在 `pnpm-workspace.yaml` 中启用 `engineStrict` 和 `managePackageManagerVersions` 选项，结合 `package.json` 中的 `packageManager` 字段，确保团队成员使用完全一致的 **pnpm** 版本
  - 在 `package.json` 的 `engines.node` 中指定精确的 **Node.js** 版本，并同步配置 `volta.node`、`.nvmrc`、`.node-version`、`useNodeVersion`（`pnpm-workspace.yaml`）等，支持主流版本管理工具的项目级自动切换
  - 开发 `verify-node-version-sync.ts` 脚本，在检查流程、`pre-commit` 钩子和持续集成中持续检测版本配置的一致性

- ✅ **模块系统与类型策略**：采用 **ESM-only** 模块系统和 **TypeScript-first** 开发策略，确保代码的现代化与类型安全。
  - 在 `package.json` 中设置 `"type": "module"`，强制使用 **ES Modules** 作为唯一的模块系统
  - 继承 `@tsconfig/strictest` 严格类型配置，充分利用 **TypeScript** 类型系统的优势
  - 对于因框架限制无法迁移至 **TypeScript** 的 **JavaScript** 文件，通过 `checkJs: true` 启用类型检查
  - 使用 `module: "esnext"` 和 `moduleResolution: "bundler"` 配置，与构建工具的模块解析策略保持一致

- ✅ **Git 忽略规则完善**：通过完善的 `.gitignore` 配置，确保各类构建产物、依赖、缓存、临时文件被正确忽略，保持仓库整洁。
  - 整合 **Linux**、**macOS**、**Windows** 三大主流操作系统的系统级文件忽略规则
  - 整合 **Node.js** 生态系统和 **Next.js** 框架的通用忽略规则
  - 针对项目强制使用 **pnpm** 的要求，添加其他包管理器相关文件的忽略规则
  - 配置按系统和技术栈分类，使用清晰的分隔符和注释，便于维护

- ✅ **代码格式化统一**：通过 `.gitattributes`、**EditorConfig** 和 **Prettier** 配置，确保团队成员保持一致的代码风格。
  - 通过 `.gitattributes`、`.editorconfig` 和 **Prettier** 的综合约束，确保所有文本文件使用 **LF** 换行符
  - 针对 **JSONC** 文件（如 `tsconfig.json`）配置 `parser: 'jsonc'`，支持更多的行尾逗号
  - 为 **JSX/TSX** 文件启用 `singleAttributePerLine: true`，提升 **Tailwind CSS** 长属性列表的可读性
  - 在 `.vscode` 中配置和推荐安装相关插件，确保 **VSCode** 用户获得开箱即用的格式化体验

- ✅ **提交信息规范检查**：通过 **Commitlint** 和 **Husky** 的 `commit-msg` 钩子，自动校验提交信息格式，确保符合 **Conventional Commits** 规范。
  - 使用 `@commitlint/config-conventional` 作为基础配置，要求提交信息包含类型（`feat`、`fix`、`docs` 等）、作用域（可选）、描述等信息
  - 通过 **Husky** 的 `commit-msg` 钩子，在每次提交时自动运行 **Commitlint** 检查
  - 不符合规范的提交会被自动阻止，确保提交历史的规范性和可追溯性

- ✅ **Lockfile 同步检查**：在 `pre-commit` 钩子中自动验证 `pnpm-lock.yaml` 与 `package.json` 的同步状态，防止依赖不一致问题。
  - 开发 `verify-lockfile-sync.ts` 脚本，执行 `pnpm install --frozen-lockfile --offline` 进行验证
  - 在 `pre-commit` 钩子和持续集成流程中集成，确保提交前依赖配置的一致性

- ✅ **Pre-commit 钩子**：通过 **nano-staged** 配置多项检查，确保提交前代码质量。
  - 集成 **Node** 运行时导入检查、**Lockfile** 同步检查、**Node.js** 版本同步检查
  - 集成 **TypeScript** 类型检查（通过 `tsc-files.ts` 脚本实现增量检查）
  - 集成 **ESLint** 代码规范检查和 **Prettier** 格式化检查
  - 所有检查均支持 `--ignore-unknown` 参数，智能过滤无关文件

- ✅ **死代码检测**：通过 **Knip** 检测未使用的文件、导出与依赖，帮助清理死代码，保持代码库整洁。
  - 在 `lint` 脚本中集成 `knip --no-progress` 命令
  - 配置 `knip.config.ts` 忽略外部类型声明文件

- ✅ **Node 运行时导入检查**：开发 `verify-node-runtime-imports.ts` 脚本，验证 **Node.js** 运行时模块导入的正确性。
  - 使用 `es-module-lexer` 解析模块导入，验证导入路径和导出名称的正确性
  - 在 `pre-commit` 钩子和持续集成流程中集成，确保运行时 CommonJS 模块正确导入

- ✅ **编辑器开箱即用**：配置 **VSCode** 设置和推荐插件，确保团队成员获得一致的开发体验。
  - 配置 `.vscode/settings.json`，设置 **ESLint** 规则级别、**Prettier** 格式化和保存时自动修复
  - 配置 `.vscode/extensions.json`，推荐安装 **ESLint**、**Prettier** 和 **EditorConfig** 插件
  - 针对不同文件类型配置独立的编辑器行为

- 📋 **配置测试框架**：选择并配置测试框架，添加测试工具脚本，创建测试目录结构和示例测试，配置测试覆盖率阈值。

- 📋 **配置 GitHub Actions 工作流**：创建持续集成工作流，集成代码规范检查、类型检查、格式化检查、测试运行、构建验证、依赖安全扫描等质量检测。

- 📋 **配置 Bundle 分析工具**：添加 **Bundle** 分析工具，创建分析脚本，在 **CI** 中生成并上传分析报告，帮助识别和优化打包体积。

- 📋 **完善 SEO 配置**：优化 `metadata` 配置，创建 `sitemap.xml` 生成器，创建 `robots.txt`，配置 **Open Graph** 和 **Twitter Card**，添加结构化数据。

- 📋 **配置 E2E 测试**：配置 **E2E** 测试框架，添加基础 **E2E** 测试示例，在 **CI** 中集成。

- 📋 **配置依赖安全扫描**：在 **CI** 中集成依赖安全扫描工具，配置自动依赖更新工具，添加安全漏洞检查脚本。

- 📋 **配置性能监控**：集成 **Web Vitals** 监控，配置 **Lighthouse CI**，在 **CI** 中运行性能测试并设置阈值。

- 📋 **配置安全头**：在 `next.config.ts` 中配置安全响应头，配置 **CSP**（内容安全策略）、**XSS** 防护和 **HTTPS** 重定向。

- 📋 **环境变量管理**：创建 `.env.example` 模板，配置环境变量验证，添加环境变量文档。

- 📋 **配置 Docker**：创建 **Dockerfile** 和 `docker-compose.yml`，添加容器化部署文档。

### ⚡ 核心功能

> 状态标记：🚧 进行中 · ✅ 已完成 · 📋 待完成

- 📋 **字体优化**：使用 [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) 自动优化和加载 [Geist](https://vercel.com/font) 字体，提升加载性能和用户体验。

- 📋 **SEO 优化**：优化 `metadata` 配置，创建 `sitemap.xml` 和 `robots.txt`，配置 **Open Graph** 和 **Twitter Card**，添加结构化数据（**JSON-LD**）。

- 📋 **可访问性**：遵循 **WCAG** 标准，确保网站对所有用户（包括使用辅助技术的用户）友好。

- 📋 **国际化支持**：配置多语言支持的基础结构，实现内容的国际化与本地化。

- 📋 **错误边界与监控**：配置 **React** 错误边界，集成错误监控服务，添加错误日志收集。

- 📋 **主题切换**：实现亮色/暗色主题切换，支持系统主题偏好检测和用户手动切换。

- 📋 **响应式设计**：基于 **Tailwind CSS** 实现移动端优先的响应式布局，适配各种屏幕尺寸。

## 🚀 快速开始

### 开发环境要求

- **pnpm**：>= 10.0.0（强制要求）
- **Node.js**：遵循 `package.json` 中的 `engines.node` 版本要求，推荐使用 [Volta](https://volta.sh/)、[NVM](https://github.com/nvm-sh/nvm)、[fnm](https://github.com/Schniz/fnm) 等版本管理工具进行项目级自动切换

> ⚠️ **重要提示**：本项目强制使用 **pnpm >= 10** 作为包管理工具。项目已配置 `preinstall` 脚本，使用其他包管理器（**npm**、**yarn**、**bun**）安装依赖时会自动阻止。

> 💡 **推荐**：本项目推荐使用 [Cursor](https://cursor.sh/) 等基于 **VSCode** 的编辑器，以获得更好的开发体验。项目已配置 `.vscode/extensions.json` 推荐插件，打开项目后按提示安装即可。

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

### 构建生产版本

```bash
pnpm run build
pnpm run start
```

## 📜 可用脚本

### 开发与构建

| 命令             | 说明           |
| ---------------- | -------------- |
| `pnpm run dev`   | 启动开发服务器 |
| `pnpm run build` | 构建生产版本   |
| `pnpm run start` | 启动生产服务器 |

### 代码检查

| 命令                                 | 说明                                       |
| ------------------------------------ | ------------------------------------------ |
| `pnpm run lint`                      | 运行所有代码检查                           |
| `pnpm run lint:node-runtime-imports` | 检查 **Node.js** 运行时模块导入正确性      |
| `pnpm run lint:lockfile`             | 检查 **Lockfile** 同步状态                 |
| `pnpm run lint:node-version`         | 检查 **Node.js** 版本配置一致性            |
| `pnpm run lint:knip`                 | 使用 **Knip** 检测未使用的文件、导出与依赖 |
| `pnpm run lint:tsc`                  | 运行 **TypeScript** 类型检查               |
| `pnpm run lint:eslint`               | 运行 **ESLint** 代码规范检查               |
| `pnpm run lint:prettier`             | 运行 **Prettier** 格式化检查               |

### 代码修复

| 命令                    | 说明                             |
| ----------------------- | -------------------------------- |
| `pnpm run fix`          | 运行所有代码修复任务             |
| `pnpm run fix:eslint`   | 使用 **ESLint** 修复可修复的问题 |
| `pnpm run fix:prettier` | 使用 **Prettier** 格式化代码     |

### ESLint 配置工具

| 命令                              | 说明                                              |
| --------------------------------- | ------------------------------------------------- |
| `pnpm run eslint:inspector`       | 使用 **ESLint Config Inspector** 可视化查看主配置 |
| `pnpm run eslint:audit`           | 运行 **ESLint** 验证配置，识别遗漏的规则          |
| `pnpm run eslint:audit:inspector` | 可视化查看验证配置结构和规则覆盖情况              |
