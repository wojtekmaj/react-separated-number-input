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
    const result = formatValue('', '00 00 0000');

    expect(result).toEqual('');
  });

  it('returns one group given no format', () => {
    const result = formatValue('12345678');

    expect(result).toEqual('12345678');
  });

  it('groups characters properly given format', () => {
    const result = formatValue('12345678', '00 00 0000');

    expect(result).toEqual('12 34 5678');
  });

  it('ignores the characters above the sum of format', () => {
    const result = formatValue('1234567890', '00 00 0000');

    expect(result).toEqual('12 34 5678');
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
