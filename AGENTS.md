# AGENTS Guidelines for This Directory or Its Children

This directory contains three TypeScript subprojects: `app`, `node`, and `lib`.

- **app**: A Next.js application containing both browser-side and server-side code.
- **node**: TypeScript code executed directly in Node.js via built-in type stripping (no transpilation required), such as configurations and scripts.
- **lib**: Shared utilities common to both `app` and `node`. Requires no standalone build; compilation is handled on-demand by the consumer (Next.js for `app`, Node.js type stripping for `node`).

When working on the project interactively with an agent (e.g., the Cursor), please follow the guidelines below to ensure a smooth development experience—particularly TypeScript type safety.
