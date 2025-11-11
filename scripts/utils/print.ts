import signale from 'signale';

interface PrintOptions {
  type?: 'info' | 'success' | 'warn' | 'error';
  title: string;
  description?: string | string[];
}
function print({ type = 'info', title, description = '' }: PrintOptions): void {
  const descriptionText = Array.isArray(description) ? description.join('\n') : description;
  const message = descriptionText ? `${title}\n\n${descriptionText}\n` : `${title}\n`;

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
  }
}

export { print };
