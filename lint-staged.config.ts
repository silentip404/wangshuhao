import type { Configuration } from 'lint-staged';

const lintStagedConfig: Configuration = {
  '*': [
    'pnpm exec node scripts/verify-lockfile-sync.ts --ignore-unknown',
    'pnpm exec node scripts/verify-node-version-sync.ts --ignore-unknown',
    'pnpm exec node scripts/tsc-files.ts --ignore-unknown',
    'eslint --no-warn-ignored --max-warnings=0',
    'prettier --ignore-unknown --check --log-level=warn',
  ],
};

export default lintStagedConfig;
