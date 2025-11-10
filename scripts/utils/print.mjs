import signale from 'signale';

/**
 * 打印错误信息
 *
 * @param {Object} options
 * @param {string} options.title - 错误标题
 * @param {string | string[]} options.description - 错误描述，支持单行文本或多行文本
 * @param {boolean} [options.exit=true] - 是否立即终止终端，默认为 true
 * @returns {never | void}
 */
function printError({ title, description, exit = true }) {
  // 将 description 转换为字符串
  const descriptionText = Array.isArray(description) ? description.join('\n') : description;

  signale.error({ title, message: descriptionText });

  if (exit) {
    process.exit(1);
  }
}

export { printError };
