/**
 * Formats string value using given format.
 *
 * @param {String} string
 * @param {String} format
 * @param {String} replacementCharacter
 */
export function formatValue(string, format, replacementCharacter) {
  if (!string || !format) {
    return string;
  }

  let i = 0;

  return format
    .split(replacementCharacter)
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
