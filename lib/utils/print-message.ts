import { consola } from 'consola';
import type { InputLogObject } from 'consola';
import { flat, isEmptyish } from 'remeda';
import { z } from 'zod';

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
  const typedOptions: InputLogObject = {
    message: title,
    additional: description,
  };

  // 在描述前添加零宽度空格以优化显示效果
  if (!isEmptyish(typedOptions.additional)) {
    typedOptions.additional = flat(['', ...[typedOptions.additional]]);
  }

  consola[type](typedOptions);
};

export type { PrintMessageOptions };
export { printMessage, printMessageOptionsSchema };
