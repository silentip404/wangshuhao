# 生成 Commit Message

## 概述

根据 Git 暂存区的文件变更，生成符合项目 Commitlint 配置规范的 commit message。

## 步骤

### 1. 获取配置

读取项目根目录下的 `scratch/commitlint-config.json` 文件获取完整规则配置，严格按照配置规则生成。

### 2. 分析暂存区变更

- 仅读取 staged 文件变更作为分析依据
- 区分主要修改与由此产生的次要修改（如重命名导致的 import 路径更新）
- 若无法准确判断修改意图，应向用户询问而非猜测

### 3. 生成 Commit Message

#### 语言与风格

- 使用与用户相同的语言生成 commit message
- subject 应简洁明了，详细说明放入 body
- 生成结果时回复应简洁，仅输出关键内容，无需过多解释

#### 原子性

- 一个 commit 应聚焦于单一目的
- 若 staged 内容包含多个不相关的改动，应提醒用户拆分提交

#### Scope 选择

- scope 应反映实际修改的模块或组件
- 若修改涉及多个模块，可使用英文逗号分隔多个 scope（如 `feat(auth,api): ...`）
- 若修改过于分散且无法归纳出明确主体，可省略 scope

### 4. 交互确认

- 不要直接执行 commit，仅提供生成的 commit message 并询问用户是否提交
- 明确告知用户生成的 commit message 基于暂存区(staged)文件分析所得
- 明确告知用户你已阅读 `scratch/commitlint-config.json` 配置，若此文件不存在则终止操作并反馈给用户，禁止读取其他 commitlint 配置文件
