import { filter, isTruthy, map, pipe } from 'remeda';
import { z } from 'zod';

import type { Config } from 'eslint/config';

const AUDIT_SETTINGS_NAMESPACE = 'audit';

const auditSettingsSchema = z.object({
  shouldPrependAllRules: z.boolean().optional(),
});

type AuditSettings = z.infer<typeof auditSettingsSchema>;

const defineAuditSettings = (
  settings: AuditSettings,
): { [AUDIT_SETTINGS_NAMESPACE]: AuditSettings } => ({
  [AUDIT_SETTINGS_NAMESPACE]: settings,
});

const resolveAuditSettingsByConfig = (config: Config): AuditSettings => {
  const unknownSettings = config.settings?.[AUDIT_SETTINGS_NAMESPACE];

  return auditSettingsSchema.parse(unknownSettings ?? {});
};

const collectSkipPrependAllRulesConfigNames = (configs: Config[]): string[] => {
  const exactConfigNames = pipe(
    configs,
    filter((config) => {
      const { shouldPrependAllRules } = resolveAuditSettingsByConfig(config);

      return shouldPrependAllRules === false;
    }),
    map((config) => config.name?.trim()),
    filter(isTruthy),
  );

  const allConfigNames = pipe(
    configs,
    map((config) => config.name?.trim()),
    filter(isTruthy),
    filter((name) =>
      exactConfigNames.some((exactName) => name.startsWith(exactName)),
    ),
  );

  return allConfigNames;
};

export { defineAuditSettings, collectSkipPrependAllRulesConfigNames };
