import { isIncludedIn, isTruthy } from 'remeda';
import signale from 'signale';
import { z } from 'zod';

import { ensureScriptsInPackage } from './ensure.ts';

const isRunningInKnip = isIncludedIn(
  process.env.npm_lifecycle_event,
  ensureScriptsInPackage(['lint:knip', 'fix:knip']),
);

const printOptionsSchema = z.object({
  type: z.enum(['info', 'success', 'warn', 'error']).optional(),
  title: z.string(),
  description: z.union([z.string(), z.array(z.string())]).optional(),
});

type PrintOptions = z.infer<typeof printOptionsSchema>;

const print = ({
  type = 'info',
  title,
  description = '',
}: PrintOptions): void => {
  if (isRunningInKnip) {
    return;
  }

  const descriptionText = Array.isArray(description)
    ? description.join('\n')
    : description;
  const message = isTruthy(descriptionText.trim())
    ? `${title}\n\n${descriptionText}\n`
    : `${title}\n`;

  signale[type](message);
};

export { print, type PrintOptions, printOptionsSchema };
