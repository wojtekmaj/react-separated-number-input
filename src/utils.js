/**
 * Changes an array of group lengths into a string-based number format.
 * For example, [1, 2, 3] will be changed into "0 00 000".
 *
 * @param {Number[]} groupLengths
 */
export function groupLengthsToFormat(groupLengths) {
  return groupLengths.reduce(
    (result, groupLength, index) => `${result}${index ? ' ' : ''}${'0'.repeat(groupLength)}`,
    '',
  );
}

/**
 * Formats string value using given format.
 *
 * @param {String} string
 * @param {String} format
 */
export function formatValue(string, format) {
  if (!string || !format) {
    return string;
  }

  let i = 0;

  return format
    .split('0')
    .map((el) => {
      // eslint-disable-next-line no-plusplus
      const char = string[i++];
      return char ? (el + char) : '';
    })
    .join('')
    .slice(0, format.length);
}

export function removeNonNumericChars(string) {
  if (!string) {
    return string;
  }

  return string.replace(/[^\d]/g, '');
}
