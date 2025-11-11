const config = {
  '*.{ts,tsx,mts}': () => 'tsc --noEmit',
  '*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}': 'eslint --max-warnings=0',
  '*': 'prettier --check --log-level=warn --ignore-unknown',
};

export default config;
