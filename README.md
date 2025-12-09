# 个人主页

> ⚠️ **项目状态：开发中**
> 本项目目前处于积极开发阶段。已完成的功能包括：**TODO List** 中标注为已完成的任务（详见下方"[已完成任务](#-todo-list)"部分，需展开查看）以及本文档其余章节中明确描述的各项实现。当前仍有大量功能处于规划或开发阶段，请勿将当前版本视为完成品。

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
- **AI 辅助编程优化**：通过 **TypeScript-first** 策略、统一代码格式、规范提交信息等工程化实践，优化项目结构以提升 **AI** 代码助手的理解准确度和代码生成质量

## 🏗️ 技术架构与功能特性

### 💻 技术栈

- **框架**：**Next.js** 16
- **UI 库**：**React** 19
- **语言**：**TypeScript**
- **样式**：**Tailwind CSS** 4
- **代码检查**：**ESLint**
- **代码格式化**：**Prettier**
- **Git 钩子管理**：**Husky**
- **提交信息规范**：**Commitlint**

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

- 📦 **模块系统与类型策略**：采用 **ESM-only**（**ES Modules**）模块系统和 **TypeScript-first** 开发策略，确保项目代码的现代化与类型安全，对于无法迁移至 **TypeScript** 的 **JavaScript** 文件同样启用类型检查，保证代码质量的一致性。

  <details>
    <summary>查看实现方案</summary>

  现代 **JavaScript** 生态正在从 **CommonJS** 向 **ES Modules** 迁移，**TypeScript** 已成为大型项目类型安全的首选方案。本项目采用 **ESM-only** 和 **TypeScript-first** 策略，确保代码库的现代化与类型安全：
  1. **ESM-only 模块系统**：在 `package.json` 中设置 `"type": "module"`，强制项目使用 **ES Modules** 作为唯一的模块系统，避免 **CommonJS** 与 **ES Modules** 混用带来的兼容性问题，提升代码的现代化程度和未来兼容性。

  2. **TypeScript-first 开发策略**：项目优先使用 **TypeScript** 进行开发，充分利用类型系统的优势，提升代码可维护性、可读性和开发体验。通过 `tsconfig.json` 配置严格的类型检查选项（`strict: true`），确保类型安全。

  3. **JavaScript 文件类型检查**：对于因框架限制或历史原因无法迁移至 **TypeScript** 的 **JavaScript** 文件（如部分配置文件），通过 `tsconfig.json` 中的 `allowJs: true` 和 `checkJs: true` 选项，启用 **TypeScript** 编译器对 **JavaScript** 文件的类型检查，通过 **JSDoc** 注释提供类型信息，确保这些文件同样享受类型检查带来的安全保障。

  4. **模块解析配置**：使用 `module: "esnext"` 和 `moduleResolution: "bundler"` 配置，确保 **TypeScript** 编译器正确处理 **ES Modules** 语法，与构建工具（**Next.js**）的模块解析策略保持一致。

  通过以上设计与实现，确保项目代码库的现代化、类型安全和一致性。

  **AI 辅助编程优化**：**TypeScript** 的类型系统为 **AI** 代码助手提供了丰富的上下文信息，类型注解、接口定义和泛型约束能够帮助 **AI** 更准确地理解代码意图、生成类型安全的代码建议，并减少类型相关的错误。对于 **JavaScript** 文件，通过 **JSDoc** 注释提供类型信息，确保 **AI** 在处理这些文件时也能获得足够的类型上下文。

  </details>

- 🚫 **Git 忽略规则完善**：通过完善的 `.gitignore` 配置，确保各类构建产物、依赖、缓存、临时文件等被正确忽略，避免误提交不必要的文件，保持仓库整洁。

  <details>
    <summary>查看实现方案</summary>

  `.gitignore` 配置是版本控制中的基础实践，不同操作系统、不同技术栈会产生不同的临时文件、缓存文件和构建产物，这些文件不应该被提交到版本库中。本项目通过整合官方推荐的 `.gitignore` 模板和项目定制化规则，实现跨平台、跨技术栈的文件忽略配置：
  - **系统级规则整合**：整合 **Linux**、**macOS**、**Windows** 三大主流操作系统的系统级文件忽略规则
  - **技术栈规则整合**：整合 **Node.js** 生态系统的通用忽略规则，覆盖主流包管理器的相关文件
  - **框架特定规则**：整合 **Next.js** 框架的默认模板规则，确保框架相关的构建产物被正确忽略
  - **项目定制化规则**：针对项目强制使用 **pnpm** 的要求，添加其他包管理器相关文件的忽略规则
  - **配置结构清晰**：配置按系统和技术栈分类，使用清晰的分隔符和注释，便于维护和理解

  通过以上设计与实现，实现跨平台、跨技术栈的文件忽略配置。

  </details>

- 🎨 **代码格式化统一**：通过 **.gitattributes**、**EditorConfig** 和 **Prettier** 配置，确保团队成员保持一致的代码风格，减少因格式差异导致的代码审查噪音和合并冲突。

  <details>
    <summary>查看配置细节</summary>

  代码格式化是团队协作中的基础工程化实践，不同编辑器、不同开发者的个人偏好会导致代码风格差异，这些差异会在代码审查和合并时产生噪音，影响开发效率。本项目通过 **.gitattributes**、**EditorConfig** 和 **Prettier** 的组合配置，实现跨编辑器、跨环境的代码风格统一：
  1. **换行符统一**：通过 `.gitattributes`、`.editorconfig`和 `prettier` 的综合约束，确保所有文本文件使用 **LF**（`\n`）作为换行符，避免 **Windows**（`\r\n`）与 **Unix/Linux**（`\n`）系统间的换行符差异导致的合并冲突。

  2. **JSONC 文件配置优化**：针对常见的 **JSONC** 文件（如 `.vscode/**/*.json`、`tsconfig.json` 等），通过 `overrides` 配置单独指定 `parser: 'jsonc'`，支持更多的行尾逗号，减少因添加或删除配置项导致的 **diff** 差异。

  3. **Tailwind CSS 阅读体验优化**：为降低使用 **Tailwind CSS** 带来的阅读心智负担，在 `prettier` 中对 **JSX/TSX/VUE** 文件启用 `singleAttributePerLine: true`，将每个属性单独成行，提升长属性列表的可读性和 **diff** 可读性。

  4. **编辑器开箱即用体验**：在 `.vscode` 中配置和推荐安装相关插件，确保使用 **VSCode** 的开发者获得开箱即用的格式化体验。

  5. **持续检测与自动化**：在检查脚本、`pre-commit` 钩子、持续集成流程中持续检测代码格式，确保提交到仓库的代码符合格式化规范。

  通过以上设计与实现，实现团队开发过程中的代码格式化统一并减轻开发者的心智负担。

  **AI 辅助编程优化**：统一的代码格式和清晰的代码结构能够显著提升 **AI** 代码助手的理解准确度。**Prettier** 自动格式化消除了代码风格差异，使 **AI** 能够专注于代码逻辑而非格式问题。**Tailwind CSS** 属性的单行显示配置提升了长属性列表的可读性，有助于 **AI** 更准确地识别和操作 **JSX** 元素。清晰的代码结构降低了 **AI** 解析代码的复杂度，提升了代码生成和建议的质量。

  </details>

- 📝 **提交信息规范检查**：通过 **Commitlint** 和 **Husky** 的 `commit-msg` 钩子，在提交时自动校验 commit message 格式，确保提交信息符合 [Conventional Commits](https://www.conventionalcommits.org/) 规范，提升提交历史可读性和可追溯性。

  <details>
    <summary>查看实现方案</summary>

  规范的 commit message 是团队协作和项目维护的基础实践，统一的提交信息格式能够提升提交历史的可读性，便于生成变更日志、定位问题、追溯代码变更。本项目通过 **Commitlint** 实现提交信息的自动校验：
  1. **规范配置**：使用 `@commitlint/config-conventional` 作为基础配置，遵循 **Conventional Commits** 规范，要求提交信息包含类型（`feat`、`fix`、`docs` 等）、作用域（可选）、描述等信息。

  2. **Git 钩子集成**：通过 **Husky** 的 `commit-msg` 钩子，在每次提交时自动运行 **Commitlint** 检查，不符合规范的提交会被自动阻止，确保提交到仓库的所有 commit message 都符合规范。

  3. **开发体验优化**：提供清晰的错误提示，帮助开发者快速了解提交信息格式要求，减少因格式问题导致的提交失败。

  通过以上设计与实现，确保项目提交历史的规范性和可追溯性。

  **AI 辅助编程优化**：规范的提交信息格式为 **AI** 代码助手提供了结构化的项目变更历史，有助于 **AI** 理解代码演进过程、识别功能边界、生成更符合项目上下文的代码建议。**Conventional Commits** 规范中的类型（`feat`、`fix`、`docs` 等）和描述信息能够帮助 **AI** 快速定位相关代码变更，提升代码审查和问题定位的效率。

  </details>

- 🔒 **Lockfile 同步检查**：在 `pre-commit` 钩子中自动运行 `pnpm install --frozen-lockfile --lockfile-only`，确保 `pnpm-lock.yaml` 与 `package.json` 保持同步，防止因 lockfile 未更新导致的依赖不一致问题。

- 🔍 **ESLint 配置验证**：通过独立的验证配置文件，确保 **ESLint** 配置的正确性和完整性，帮助团队识别配置错误和遗漏的规则。

  <details>
    <summary>查看实现方案</summary>

  **ESLint** 配置的复杂性可能导致规则遗漏或配置错误，这些问题在常规代码检查中难以发现。本项目通过独立的验证配置文件实现配置的全面检查：
  1. **验证配置独立**：创建 `eslint.config.validate.ts` 作为独立的验证配置文件，基于主配置扩展，启用所有可用规则作为警告，确保配置的完整性。

  2. **规则覆盖检查**：验证配置会自动检测所有已安装插件的规则，并将未在主配置中显式设置的规则设置为警告级别，帮助识别可能遗漏的规则。验证过程会显示所有被检测到的插件，便于开发者了解配置的覆盖范围。

  3. **配置验证脚本**：在 `package.json` 中添加 `eslint:validate` 脚本，用于运行验证配置，确保配置的正确性。同时提供 `eslint:validate:inspector` 脚本，使用 **ESLint Config Inspector** 工具可视化查看验证配置，帮助开发者更直观地理解配置结构和规则覆盖情况。

  4. **配置完整性提示**：验证配置会自动检查每个配置对象的 `name` 属性，缺失时会给出警告提示，建议使用 `eslint:validate:inspector` 命令辅助检查配置的完整性。

  通过以上设计与实现，确保 **ESLint** 配置的正确性、完整性和可持续的维护性。

  </details>

### 📈 性能指标

## 📋 TODO List

<details>
  <summary><strong>已完成任务</strong></summary>

- [x] **完善 .gitignore 配置规则**：完善当前 `.gitignore` 配置规则，要求结构清晰，兼容不同系统差异（**Windows**、**macOS**、**Linux**），确保各类构建产物、依赖、缓存、临时文件等被正确忽略，避免误提交不必要的文件。

- [x] **Git 钩子中检测 commit message 规范**：在 Git 钩子中配置 commit message 格式校验，确保提交信息符合项目规范，提升提交历史可读性和可追溯性。

- [x] **Pre-commit 钩子中添加 Lockfile 同步检查**：在 `pre-commit` 钩子中自动检查 `pnpm-lock.yaml` 与 `package.json` 是否保持同步。

- [x] **Node.js 版本配置一致性检测脚本**：开发自动化检查脚本，用于验证项目中分散的 **Node.js** 版本配置文件（`.nvmrc`、`.node-version`、`package.json` 中的 `engines.node` 和 `volta.node`、`pnpm-workspace.yaml` 中的 `useNodeVersion` 等）的一致性，确保版本配置同步。

- [x] **解决 .gitignore 文件换行符处理问题**：研究并解决部分编辑器（如 **VSCode**）在保存 `.gitignore` 文件时会自动处理行尾换行符，导致 **macOS** 系统特有的 `Icon\r` 文件忽略规则无法正确保存的问题，确保跨平台文件忽略规则的正确性。

- [x] **scripts 目录说明文档**：为 `scripts` 目录添加说明文档，详细说明各个脚本的用途、使用方法和实现细节，帮助团队成员理解和使用项目中的自动化脚本。

- [x] **统一代码检查命令**：汇总项目中分散的代码检查相关脚本（**Node.js** 版本配置一致性检查、**Lockfile** 同步检查、**ESLint** 代码规范检查、**Prettier** 格式化检查、**TypeScript** 类型检查等），集成为一个统一的检查命令，简化检查流程。

- [x] **完善 lint-staged 配置**：在 **lint-staged** 中配置 **ESLint** 检查和 **TypeScript** 类型检查，确保在提交代码前自动对暂存的文件进行代码规范检查，与 **Prettier** 格式化配合使用，提升代码质量并减少代码审查中的规范性问题。

- [x] **添加 TypeScript 类型检查脚本**：在 `package.json` 中添加 **TypeScript** 类型检查脚本，并在 **pre-commit** 钩子和 **CI/CD** 流程中集成，确保代码类型安全。

</details>

- [ ] **优化 ESLint 配置**：检查 **Next.js** 默认的 **ESLint** 配置，根据项目需求进行恰当的优化，包括规则调整、插件扩展、性能优化等，确保代码规范检查既严格又实用，提升开发体验和代码质量。

- [ ] **优化 React 组件箭头函数代码风格**：开发自定义 **ESLint** 规则，对返回 **React** 组件的箭头函数单独处理 `arrow-body-style` 规则，在保持项目整体 `'arrow-body-style': ['warn', 'always']` 风格的同时，允许组件函数使用更简洁的表达式体语法，提升代码可读性和开发体验。

- [ ] **配置测试框架**：选择并配置测试框架，添加测试工具脚本，创建测试目录结构和示例测试，配置测试覆盖率阈值。

- [ ] **配置 GitHub Actions 工作流**：创建持续集成工作流，集成代码规范检查、类型检查、格式化检查、测试运行、构建验证、依赖安全扫描等质量检测，确保代码质量与项目稳定性。

- [ ] **配置 Bundle 分析工具**：添加 **Bundle** 分析工具，创建分析脚本，在 **CI** 中生成并上传分析报告，帮助识别和优化打包体积。

- [ ] **验证字体优化配置**：验证项目是否保持使用 [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) 自动优化和加载 [Geist](https://vercel.com/font) 字体的配置，检查字体加载性能。

- [ ] **完善 SEO 配置**：优化 `metadata` 配置，创建 `sitemap.xml` 生成器，创建 `robots.txt`，配置 **Open Graph** 和 **Twitter Card**，添加结构化数据（**JSON-LD**）。

- [ ] **配置可访问性检查**：在 **ESLint** 中添加可访问性检查插件，配置可访问性测试工具，在 **CI** 中集成可访问性检查。

- [ ] **配置 E2E 测试**：配置 **E2E** 测试框架，添加基础 **E2E** 测试示例，在 **CI** 中集成。

- [ ] **配置依赖安全扫描**：在 **CI** 中集成依赖安全扫描工具，配置自动依赖更新工具，添加安全漏洞检查脚本。

- [ ] **配置构建产物验证**：在 **CI** 中验证生产构建是否成功，检查构建产物大小，验证关键路由可访问性。

- [ ] **配置性能监控**：集成 **Web Vitals** 监控，配置 **Lighthouse CI**，在 **CI** 中运行性能测试并设置阈值。

- [ ] **配置安全头**：在 `next.config.ts` 中配置安全响应头，配置 **CSP**（内容安全策略），配置 **XSS** 防护，配置 **HTTPS** 重定向。

- [ ] **环境变量管理**：创建 `.env.example` 模板，配置环境变量验证，添加环境变量文档。

- [ ] **配置代码覆盖率报告**：配置测试覆盖率收集，在 **CI** 中生成覆盖率报告，设置覆盖率阈值，集成覆盖率服务。

- [ ] **优化开发体验**：配置 **VSCode** 调试配置，添加更多 **VSCode** 推荐插件，配置 **VSCode** 任务，解决 **VSCode** 插件 **Node.js** 版本限制问题（如可能）。

- [ ] **配置部署相关**：配置部署平台相关设置，添加部署前检查脚本，配置部署通知。

- [ ] **配置路径别名优化**：检查并优化 `tsconfig.json` 中的路径别名，确保所有导入使用别名，添加路径别名文档。

- [ ] **配置导入排序**：使用导入排序插件，统一导入顺序规范。

- [ ] **创建项目结构规范**：定义目录结构规范，创建组件、工具函数、类型定义的组织方式，添加架构决策记录（**ADR**）。

- [ ] **配置错误监控**：集成错误监控服务，配置错误边界，添加错误日志收集。

- [ ] **配置国际化基础**：配置国际化方案，添加多语言支持的基础结构。

- [ ] **配置 Docker**：创建 **Dockerfile**，创建 `docker-compose.yml`，添加容器化部署文档。

- [ ] **配置代码生成工具**：配置代码生成工具，创建组件、页面等模板。

## 🚀 快速开始

### 开发环境要求

- **pnpm**：>= 10.0.0（强制要求）
- **Node.js**：遵循 `package.json` 中的 `engines.node` 版本要求。推荐使用 [Volta](https://volta.sh/)、[NVM](https://github.com/nvm-sh/nvm)、[n](https://github.com/tj/n) 等版本管理工具进行项目级别的自动版本管理，项目已配置相应的配置文件以支持这些工具。

> ⚠️ **重要提示**：本项目强制使用 **pnpm >= 10** 作为包管理工具。项目已配置 `preinstall` 脚本，使用其他包管理器（**npm**、**yarn**、**bun**）安装依赖时会自动阻止。

> 💡 **推荐**：本项目推荐使用 [Cursor](https://cursor.sh/) 等基于 **VSCode** 的编辑器，以获得更好的开发体验。

> 🤖 **AI 辅助编程提示**：本项目采用 **TypeScript-first** 策略、统一的代码格式和规范的提交信息，这些工程化实践能够显著提升 **AI** 代码助手的理解准确度和代码生成质量。在使用 **AI** 辅助编程时，建议充分利用项目的类型系统、清晰的文档结构和规范的代码风格，以获得更好的 **AI** 辅助效果。

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
pnpm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 📜 可用脚本

### 开发与构建

- `pnpm run dev` - 启动开发服务器
- `pnpm run build` - 构建生产版本
- `pnpm run start` - 启动生产服务器

### 代码检查

- `pnpm run lint` - 运行所有代码检查
- `pnpm run lint:node-version` - 检查 **Node.js** 版本配置一致性
- `pnpm run lint:typesync` - 检查 **TypeScript** 类型定义同步状态
- `pnpm run lint:lockfile` - 检查 **Lockfile** 同步状态
- `pnpm run lint:knip` - 使用 **Knip** 检测未使用的文件、导出与依赖，帮助清理死代码
- `pnpm run lint:tsc` - 运行 **TypeScript** 类型检查
- `pnpm run lint:eslint` - 运行 **ESLint** 代码规范检查
- `pnpm run lint:prettier` - 运行 **Prettier** 格式化检查
- `pnpm run lint:success-message` - 打印所有检查通过的成功消息

### 代码修复

- `pnpm run fix` - 运行所有代码修复任务
- `pnpm run fix:typesync` - 自动同步 **TypeScript** 类型定义
- `pnpm run fix:knip` - 使用 **Knip** 自动移除未使用的文件、导出与依赖
- `pnpm run fix:eslint` - 使用 **ESLint** 修复可修复的问题
- `pnpm run fix:prettier` - 使用 **Prettier** 格式化代码
- `pnpm run fix:complete-message` - 打印所有修复任务完成的信息提示

### ESLint 配置工具

- `pnpm run eslint:inspector` - 使用 **ESLint Config Inspector** 可视化查看主 **ESLint** 配置
- `pnpm run eslint:validate` - 运行 **ESLint** 验证配置的正确性和完整性，帮助团队识别配置错误和遗漏的规则
- `pnpm run eslint:validate:inspector` - 使用 **ESLint Config Inspector** 可视化查看验证配置，帮助更直观地理解配置结构和规则覆盖情况
