import { consola } from 'consola';

const printError = (error: Error): void => {
  consola.error(error);
};

export { printError };
