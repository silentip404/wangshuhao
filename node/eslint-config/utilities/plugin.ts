import type { Config } from 'eslint/config';
import { forEach, isEmptyish, keys } from 'remeda';

const collectPluginNames = (configs: Config[]): string[] => {
  const pluginNames = new Set<string>();

  forEach(configs, (config) => {
    const { plugins } = config;

    if (isEmptyish(plugins)) {
      return;
    }

    for (const pluginName of keys(plugins)) {
      pluginNames.add(pluginName);
    }
  });

  return [...pluginNames];
};

export { collectPluginNames };
