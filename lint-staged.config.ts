const config = {
  // lint-staged:node-version
  '{package.json,pnpm-workspace.yaml,.nvmrc,.node-version}': () =>
    'node scripts/verify-node-version-config.ts',

  // lint-staged:lockfile
  '{package.json,pnpm-lock.yaml}': () =>
    'pnpm install --frozen-lockfile --lockfile-only --loglevel=warn',

  // lint-staged:typescript
  '*.{ts,tsx}': () => 'tsc --noEmit',

  // lint-staged:eslint
  '*.{js,jsx,ts,tsx}': 'eslint --max-warnings=0',

  // lint-staged:prettier
  '*': 'prettier --check --log-level=warn --ignore-unknown',
};

export default config;
