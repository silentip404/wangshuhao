# AGENTS Guidelines for This Directory or Its Children

This directory contains three TypeScript subprojects: `app`, `node`, and `lib`.

- **app**: A Next.js application containing both browser-side and server-side code.
- **node**: TypeScript code executed directly in Node.js via built-in type stripping (no transpilation required), such as configurations and scripts.
- **lib**: Shared utilities common to both `app` and `node`. Requires no standalone build; compilation is handled on-demand by the consumer (Next.js for `app`, Node.js type stripping for `node`).

When the subproject of a file cannot be determined from its path, read `tsconfig.json` and the referenced configuration files (`tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.lib.json`) to identify which subproject includes the file via its `include` patterns.

---

## TypeScript Type Safety

- **MUST** ensure all generated code is free of TypeScript errors
- **MUST NOT** suppress any TypeScript errors

### Runtime Type Validation with Zod

Use Zod for runtime type validation with the following conventions:

| Subproject   | Method         | Error Handling                             |
| ------------ | -------------- | ------------------------------------------ |
| `node`       | `.parse()`     | Let validation errors throw                |
| `lib`, `app` | `.safeParse()` | Handle validation failure cases explicitly |

### Handling Unavoidable Third-Party Type Issues

If genuinely unavoidable third-party type compatibility issues are encountered:

- **MUST** document the reason in `ts-expect-error.ts` following the existing structure
- **MUST** use `@ts-expect-error` with the required format: `@ts-expect-error -- See reasons['<reason-key>'] in ts-expect-error.ts`
- **MUST** ensure the reason key matches a key defined in `ts-expect-error.ts`

---

## Linting and Formatting

- **SHOULD** ignore all Prettier formatting issues; the project has automated formatting
- **SHOULD** only address ESLint issues reported at the `error` level; warnings and other severity levels **SHOULD** be ignored
