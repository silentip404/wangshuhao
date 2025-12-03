import { isIncludedIn, isTruthy } from 'remeda';
import signale from 'signale';
import { z } from 'zod';

import { ensureScriptsInPackage } from './ensure.ts';

const isRunningInKnip = isIncludedIn(
  process.env.npm_lifecycle_event,
  ensureScriptsInPackage(['lint:knip', 'fix:knip']),
);

interface PrintOptions {
  type?: 'info' | 'success' | 'warn' | 'error';
  title: string;
  description?: string | string[];
}

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

  switch (type) {
    case 'info':
      signale.info(message);
      break;
    case 'success':
      signale.success(message);
      break;
    case 'warn':
      signale.warn(message);
      break;
    case 'error':
      signale.error(message);
      break;
    default: {
      const unknownTypeSchema = z.string();
      const parsedUnknownType = unknownTypeSchema.safeParse(type);

      if (!parsedUnknownType.success) {
        throw new Error(parsedUnknownType.error.message);
      }

      throw new Error(`未知的 type 类型: ${parsedUnknownType.data}`);
    }
  }
};

export { print };
