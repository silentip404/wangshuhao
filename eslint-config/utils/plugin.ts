import { forEach, isEmptyish, keys } from 'remeda';

import type { Config } from 'eslint/config';

export const collectPluginNamesByConfigs = (configs: Config[]): string[] => {
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
