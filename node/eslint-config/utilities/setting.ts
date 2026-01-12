import type { Config } from 'eslint/config';
import { map, merge } from 'remeda';
import { z } from 'zod';

const LOCAL_SETTINGS_NAMESPACE = 'local-settings';

const localSettingsSchema = z.object({
  shouldPrependAllRules: z.boolean().optional(),
});

type LocalSettings = z.infer<typeof localSettingsSchema>;

const appendLocalSettings = (
  settings: LocalSettings,
  configs: Config[],
): Config[] =>
  map(configs, (config) => ({
    ...config,
    settings: merge(config.settings, {
      [LOCAL_SETTINGS_NAMESPACE]: settings,
    }),
  }));

const resolveLocalSettings = (config: Config): LocalSettings => {
  const unknownSettings = config.settings?.[LOCAL_SETTINGS_NAMESPACE];

  return localSettingsSchema.parse(unknownSettings ?? {});
};

export { appendLocalSettings, resolveLocalSettings };
