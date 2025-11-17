import { defineConfig } from 'eslint/config';

const importRules = defineConfig({
  rules: {
    /**
     * 强制使用 node: 协议导入 Node.js 内置模块
     *
     * 示例：
     * ✅ import fs from 'node:fs'
     * ❌ import fs from 'fs'
     *
     * 理由：
     * - 明确标识内置模块，提升代码可读性
     * - AI 辅助编程友好，减少模块类型识别错误
     */
    'import/enforce-node-protocol-usage': ['warn', 'always'],
  },
});

export { importRules };
