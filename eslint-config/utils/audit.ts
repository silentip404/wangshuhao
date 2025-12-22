import { type Config } from 'eslint/config';
import { map, merge } from 'remeda';
import { z } from 'zod';

const AUDIT_SETTINGS_NAMESPACE = 'audit';

const auditSettingsSchema = z.object({
  shouldPrependAllRules: z.boolean().optional(),
});

type AuditSettings = z.infer<typeof auditSettingsSchema>;

const defineConfigWithAuditSettings = (
  configs: Config[],
  settings: AuditSettings,
): Config[] =>
  map(configs, (config) => ({
    ...config,
    settings: merge(config.settings, { [AUDIT_SETTINGS_NAMESPACE]: settings }),
  }));

const resolveAuditSettings = (config: Config): AuditSettings => {
  const unknownSettings = config.settings?.[AUDIT_SETTINGS_NAMESPACE];

  return auditSettingsSchema.parse(unknownSettings ?? {});
};

export { defineConfigWithAuditSettings, resolveAuditSettings };
