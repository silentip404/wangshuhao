import { consola } from 'consola';
import { isIncludedIn } from 'remeda';
import { z } from 'zod';

import { ensureScriptsInPackage } from './ensure.ts';

import type { InputLogObject } from 'consola';

const isRunningInKnip = isIncludedIn(
  process.env.npm_lifecycle_event,
  ensureScriptsInPackage(['lint:knip', 'fix:knip']),
);

const printMessageOptionsSchema = z.object({
  type: z.enum(['info', 'success', 'warn', 'error']).optional(),
  title: z.string(),
  description: z.union([z.string(), z.array(z.string())]).optional(),
});

type PrintMessageOptions = z.infer<typeof printMessageOptionsSchema>;

const printMessage = ({
  type = 'info',
  title,
  description = '',
}: PrintMessageOptions): void => {
  if (isRunningInKnip) {
    return;
  }

  const typedOptions: InputLogObject = {
    message: title,
    additional: description,
  };

  consola[type](typedOptions);
};

export { printMessage, type PrintMessageOptions, printMessageOptionsSchema };
