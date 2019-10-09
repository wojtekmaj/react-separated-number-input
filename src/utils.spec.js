import {
  formatValue,
  removeNonNumericChars,
} from './utils';

describe('formatValue()', () => {
  it('returns nothing given nothing', () => {
    const result = formatValue('');

    expect(result).toEqual('');
  });

  it('returns empty array given empty string', () => {
    const result = formatValue('', '## ## ####', '#');

    expect(result).toEqual('');
  });

  it('returns one group given no format', () => {
    const result = formatValue('12345678', undefined, '#');

    expect(result).toEqual('12345678');
  });

  it('groups characters properly given format', () => {
    const result = formatValue('12345678', '## ## ####', '#');

    expect(result).toEqual('12 34 5678');
  });

  it('ignores the characters above the format character count', () => {
    const result = formatValue('1234567890', '## ## ####', '#');

    expect(result).toEqual('12 34 5678');
  });

  it('ignores non-numeric characters above the format character count', () => {
    const result = formatValue('1234', '## ## ####', '#');

    expect(result).toEqual('12 34');
  });
});

describe('removeNonNumericChars()', () => {
  it('returns nothing given nothing', () => {
    const result = removeNonNumericChars();

    expect(result).toBe(undefined);
  });

  it('returns empty string given empty string', () => {
    const result = removeNonNumericChars('');

    expect(result).toBe('');
  });

  it('removes non-numeric characters properly', () => {
    const result = removeNonNumericChars('12ac34ąć56AC');

    expect(result).toBe('123456');
  });
});
