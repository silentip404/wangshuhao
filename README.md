这是一个使用 [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) 创建的 [Next.js](https://nextjs.org) 项目，作为我的个人主页C端项目用于展示一些开发技能、编码习惯、对UI交互的理解...

## 开发环境要求

- **Node.js**: >= 24.11.0
- **pnpm**: >= 10.0.0（**强制要求**）

> ⚠️ **重要提示**: 本项目强制使用 `pnpm >= 10` 作为包管理工具。项目已配置 `preinstall` 脚本，使用其他包管理器（npm、yarn、bun）安装依赖时会自动阻止。

> 💡 **推荐**: 本项目推荐使用 [Cursor](https://cursor.sh/) 等基于 VSCode 的编辑器，以获得更好的开发体验。

<details>
<summary><strong>安装推荐的 VSCode 插件</strong></summary>

在开始开发之前，请先安装项目推荐的 VSCode 插件，以获得最佳的开发体验：

1. 打开 VSCode
2. 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac) 打开命令面板
3. 输入 `Extensions: Show Recommended Extensions` 并选择
4. 点击每个推荐的插件右侧的"安装"按钮

或者，您可以手动安装以下插件：

- **[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)** - 代码格式化工具
- **[EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)** - 编辑器配置统一

</details>

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 可用脚本

- `pnpm dev` - 启动开发服务器
- `pnpm build` - 构建生产版本
- `pnpm start` - 启动生产服务器
- `pnpm lint` - 运行 ESLint 检查
- `pnpm format` - 使用 Prettier 格式化代码

<details>
<summary><strong>项目技术栈</strong></summary>

- **框架**: Next.js 16
- **UI 库**: React 19
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **代码检查**: ESLint
- **代码格式化**: Prettier

本项目使用 [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) 自动优化和加载 [Geist](https://vercel.com/font)，这是 Vercel 的新字体家族。

</details>
