import { consola } from 'consola';
import { flat, isEmptyish, isIncludedIn } from 'remeda';
import { z } from 'zod';

import { ensureScriptsInPackage } from './ensure.ts';

import type { InputLogObject } from 'consola';

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
  const isRunningInKnip = isIncludedIn(
    process.env.npm_lifecycle_event,
    ensureScriptsInPackage(['lint:knip', 'fix:knip']),
  );
  if (isRunningInKnip) {
    return;
  }

  const typedOptions: InputLogObject = {
    message: title,
    additional: description,
  };

  // 在描述前添加零宽度空格以优化显示效果
  if (!isEmptyish(typedOptions.additional)) {
    typedOptions.additional = flat(['\u200B', ...[typedOptions.additional]]);
  }

  consola[type](typedOptions);
};

const printError = (error: Error): void => {
  consola.error(error);
};

export {
  printMessage,
  type PrintMessageOptions,
  printMessageOptionsSchema,
  printError,
};
