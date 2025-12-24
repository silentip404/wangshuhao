import type { Config } from 'eslint/config';
import { forEach, isEmptyish, keys } from 'remeda';

const collectPluginNames = (configs: Config[]): string[] => {
  const pluginNames = new Set<string>();

  forEach(configs, (config) => {
    const { plugins } = config;

    if (isEmptyish(plugins)) {
      return;
    }

    keys(plugins).forEach((pluginName) => pluginNames.add(pluginName));
  });

  return Array.from(pluginNames);
};

export { collectPluginNames };
