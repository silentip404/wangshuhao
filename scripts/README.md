# Scripts 目录说明

本目录包含项目中的自动化脚本，用于辅助开发、构建和验证流程。

## 📁 目录结构

```
scripts/
├── README.md                      # 本说明文档
├── cli-print.ts                   # 命令行打印工具脚本
├── verify-node-version-config.ts   # Node.js 版本配置一致性检查脚本
└── utils/                          # 工具函数目录
```

## 📝 脚本说明

### `cli-print.ts`

命令行打印工具，用于在命令行中打印各类消息。支持多种消息类型，可设置标题和描述内容。

### `verify-node-version-config.ts`

验证项目中分散的 Node.js 版本配置文件的一致性，确保所有配置与 `package.json` 中的 `engines.node` 字段严格一致。

### `utils/`

工具函数目录，包含脚本中使用的通用工具函数，详见 `utils/README.md`。
