const reasons: Record<string, string[]> = {
  /**
   * https://github.com/typescript-eslint/typescript-eslint/issues/11543
   */
  'typescript-eslint/issues/11543': [
    // 问题概述
    '从 @typescript-eslint/utils 重新导出类型的插件与 ESLint 原生 defineConfig 类型不兼容',

    // 冲突细节
    '@typescript-eslint/utils 的 FlatConfig.LanguageOptions 与 eslint 的 Linter.LanguageOptions 类型冲突',
    '具体表现为 LooseParserModule 无法赋值给 Parser 类型',
    'parseForESLint().ast 返回 unknown 类型，但 ESLint 期望 Program 类型',

    // 受影响插件
    'eslint-plugin-import-x',
    'eslint-plugin-import-zod',
    '其他使用 @typescript-eslint/utils 类型的插件（如本地创建的 local-plugin 插件）',
  ],
};

export { reasons };
