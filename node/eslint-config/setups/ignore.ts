import createIgnoreConfig from 'eslint-config-flat-gitignore';

const ignoreSetup = createIgnoreConfig({
  root: true,
  files: ['.gitignore', '.husky/_/.gitignore'],
});

export { ignoreSetup };
