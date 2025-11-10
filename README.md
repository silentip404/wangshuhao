# 个人主页

> 一个持续更新的在线个人主页，基于 [Next.js](https://nextjs.org) 构建。用于集中展示开发作品与职业技能，帮助访问者在最短时间内了解项目经验、技术能力与发展方向。

## 项目目标

- **可验证的"活简历"**：相比传统简历，可直接体验成品、查看源码与技术细节，提供可验证的能力证明。
- **系统化呈现**：将分散在各处的项目、Demo、资源整合至统一入口，便于管理与维护。
- **技术深耕与复盘**：以项目为载体持续实践性能优化、可访问性、工程化与 **DevOps**，并记录技术决策与权衡。
- **个人品牌与被动机会**：通过 **SEO** 优化与分享链接提升可见度，获得更多职业发展机会。
- **端到端能力证明**：从设计、开发到部署上线的完整闭环，体现独立完成与问题解决能力。
- **开源协作与反馈**：公开代码接受建议，在真实反馈中迭代成长。

## 解决的问题

- **招聘沟通低效**：提供可直接访问的作品与代码链接，减少口头描述的不确定性，提升沟通效率。
- **作品分散难维护**：统一入口管理项目与更新，避免信息过时或链接失效，降低维护成本。
- **能力难量化**：通过实际运行的项目与可审查的代码，弥补简历中"精通"、"熟悉"等难以量化的能力表述。

## 技术能力证明

- **现代前端栈实践**：框架、路由、状态管理、构建与部署
- **性能与可访问性**：性能优化、可访问性、**SEO** 的落地实践
- **工程化与自动化**：代码规范、测试、**CI/CD**、版本管理
- **文档与架构**：高质量文档与清晰的信息架构

## 🏗️ 技术架构与功能特性

### 💻 技术栈

- **框架**：**Next.js** 16
- **UI 库**：**React** 19
- **语言**：**TypeScript**
- **样式**：**Tailwind CSS** 4
- **代码检查**：**ESLint**
- **代码格式化**：**Prettier**
- **Git 钩子管理**：**Husky**（实现提交前自动校验与格式化等操作）

### ⚡ 核心功能

### 🎨 设计特性

### 🛠️ 工程化实践

- 🔒 **环境统一**：工程化方案强制锁定包管理器（**pnpm**）与 **Node.js** 版本，尽可能避免团队协作中的依赖异常、环境漂移。

  <details>
    <summary>查看实现方案</summary>

  当前包管理器生态中存在多种选择（**pnpm**/**npm**/**yarn classic**/**yarn berry**/**bun** 等），各有优势，但团队协作的核心要求是统一工具及其版本。本项目采用 **pnpm** 作为唯一的包管理工具，并实现 **Node.js** 与包管理器的统一版本管理方案：
  1. **包管理器锁定**：在 `package.json` 的 `scripts.preinstall` 中配置 `npx only-allow pnpm`，限制项目仅可使用 **pnpm** 作为包管理工具。

  2. **包管理器版本统一**：在 `.npmrc`（**pnpm@<10**）或 `pnpm-workspace.yaml`（**pnpm@>=10**）中启用 `engineStrict` 选项，结合 `package.json` 的 `"engines.pnpm": ">=10"` 确保当前运行的 **pnpm** 支持 [managePackageManagerVersions](https://pnpm.io/settings#managepackagemanagerversions) 选项，并在 `package.json` 中指定 `"packageManager": "pnpm@x.x.x"`，确保所有团队成员使用完全一致的 **pnpm** 版本进行依赖安装。

  3. **Node.js 版本统一**：在 `.npmrc`（**pnpm@<10**）或 `pnpm-workspace.yaml`（**pnpm@>=10**）中启用 `engineStrict` 选项，结合 `package.json` 的 `"engines.node": "x.x.x"` 确保所有团队成员使用 **pnpm** 运行此项目时使用完全相同的 **Node.js** 版本。同时配置文档说明、`volta.node`（`package.json`）、`.nvmrc`、`.node-version`、`useNodeVersion`（`pnpm-workspace.yaml`）等，以支持主流 **Node.js** 版本管理工具的项目级配置，降低团队成员的环境切换成本。

  4. **配置同步校验**：鉴于 **Node.js** 版本管理配置分散在多个文件中，为降低持续迭代过程中版本升级的维护成本，在检查脚本、`pre-commit` 钩子、持续集成流程中持续检测这些配置的一致性。

  通过以上设计与实现，实现团队开发过程中的环境统一。

  **已知限制**：当前无法确保 **TypeScript**、**ESLint**、**Prettier** 等 **VSCode** 插件运行时使用的 **Node.js** 版本完全符合项目要求。

  </details>

### 📈 性能指标

## 📋 TODO

- [ ] **Node.js 版本配置一致性检测脚本**：开发自动化检查脚本，用于验证项目中分散的 **Node.js** 版本配置文件（`.nvmrc`、`.node-version`、`package.json` 中的 `engines.node` 和 `volta.node`、`pnpm-workspace.yaml` 中的 `useNodeVersion` 等）的一致性，确保版本配置同步。

- [ ] **持续集成检测流程**：在 **CI/CD** 流程中集成各类质量检测，包括代码规范检查、类型检查、测试覆盖率、依赖安全扫描、构建产物验证等，确保代码质量与项目稳定性。

- [ ] **字体优化配置检查**：验证项目是否保持使用 [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) 自动优化和加载 [Geist](https://vercel.com/font) 字体的配置。

## 🚀 快速开始

### 开发环境要求

- **pnpm**：>= 10.0.0（强制要求）
- **Node.js**：遵循 `package.json` 中的 `engines.node` 版本要求。推荐使用 [Volta](https://volta.sh/)、[NVM](https://github.com/nvm-sh/nvm)、[n](https://github.com/tj/n) 等版本管理工具进行项目级别的自动版本管理，项目已配置相应的配置文件以支持这些工具。

> ⚠️ **重要提示**：本项目强制使用 **pnpm >= 10** 作为包管理工具。项目已配置 `preinstall` 脚本，使用其他包管理器（**npm**、**yarn**、**bun**）安装依赖时会自动阻止。

> 💡 **推荐**：本项目推荐使用 [Cursor](https://cursor.sh/) 等基于 **VSCode** 的编辑器，以获得更好的开发体验。

<details>
  <summary><strong>安装推荐的 VSCode 插件</strong></summary>

在开始开发之前，请先安装项目推荐的 **VSCode** 插件，以获得最佳的开发体验：

1. 打开 **VSCode**
2. 按 `Ctrl+Shift+P`（Windows/Linux）或 `Cmd+Shift+P`（Mac）打开命令面板
3. 输入 `Extensions: Show Recommended Extensions` 并选择
4. 点击每个推荐的插件右侧的"安装"按钮

项目推荐的插件列表请参考 `.vscode/extensions.json` 配置文件。

</details>

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 📜 可用脚本

- `pnpm dev` - 启动开发服务器
- `pnpm build` - 构建生产版本
- `pnpm start` - 启动生产服务器
- `pnpm lint` - 运行 **ESLint** 检查
- `pnpm format` - 使用 **Prettier** 格式化代码
