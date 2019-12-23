import React, { Component } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';

import { formatValue, removeNonNumericChars } from './utils';

const baseClassName = 'react-separated-number-input';

/**
 * On iOS 12 and lower, inputmode="numeric" is not supported, so pattern="\d*"
 * needs to be set instead for a split second to tirgger the right keyboard.
 */
const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

/**
 * Allows to use multiple refs on a single React element.
 * Supports both functions and ref objects created using createRef() and useRef().
 *
 * Usage:
 * ```jsx
 * <div ref={mergeRefs(ref1, ref2, ref3)} />
 * ```
 *
 * @param {...Array<Function|Object>} inputRefs Array of refs
 */
function mergeRefs(...inputRefs) {
  return (ref) => {
    inputRefs.forEach((inputRef) => {
      if (!inputRef) {
        return;
      }

      if (typeof inputRef === 'function') {
        inputRef(ref);
      } else {
        // eslint-disable-next-line no-param-reassign
        inputRef.current = ref;
      }
    });
  };
}

export default class SeparatedNumberInput extends Component {
  state = {
    // eslint-disable-next-line react/destructuring-assignment
    value: this.props.defaultValue,
    selectionStart: null,
  };

  get isControlled() {
    return 'value' in this.props;
  }

  get value() {
    // eslint-disable-next-line react/destructuring-assignment
    return this.isControlled ? this.props.value : this.state.value;
  }

  get format() {
    if ('format' in this.props) {
      const { format } = this.props;
      return format;
    }

    if ('groupLengths' in this.props) {
      const { groupLengths } = this.props;
      return groupLengths.reduce((str, num, index) => str + (index ? ' ' : '') + '#'.repeat(num), '');
    }

    return undefined;
  }

  get formattedValue() {
    const { format, value } = this;
    const { replacementCharacter } = this.props;
    return formatValue(value, format, replacementCharacter);
  }

  onChange = (event) => {
    const { format, value } = this;
    const { onChange } = this.props;
    const { selectionStart, value: inputValue } = event.target;

    // TODO: That's not ideal, what if we added a character at the beginning?
    const nextValue = (() => {
      let result = '';
      inputValue.split('').forEach((char, index) => {
        if (char !== format[index]) {
          result += char;
        }
      });
      return removeNonNumericChars(result);
    })();

    const adjustedSelectionStart = (() => {
      if (selectionStart === inputValue.length) {
        // User's cursor is at the end of input - no alignments necessary
        return null;
      }

      const characterAdded = (value ? value.length <= nextValue.length : true);
      const isCaretAfterSeparator = inputValue[selectionStart - characterAdded ? 0 : 1] === ' ';
      // TODO: Now that format can have more than one characters between numbers, we need to measure it
      const offset = characterAdded ? 1 : -1;

      return isCaretAfterSeparator ? selectionStart + offset : selectionStart;
    })();

    this.setState({
      selectionStart: adjustedSelectionStart,
      value: nextValue,
    });

    if (onChange) {
      onChange(event);
    }
  }

  onTouchStart = (event) => {
    const { onTouchStart } = this.props;

    if (iOS) {
      // Sets pattern for iOS devices to trigger numeric keyboard
      this.input.setAttribute('pattern', '\\d*');
    }

    if (onTouchStart) {
      onTouchStart(event);
    }
  };

  onTouchEnd = (event) => {
    const { onTouchEnd, pattern } = this.props;

    if (iOS) {
      requestAnimationFrame(() => {
        if (pattern) {
          this.input.setAttribute('pattern', pattern);
        } else {
          this.input.removeAttribute('pattern');
        }
      });
    }

    if (onTouchEnd) {
      onTouchEnd(event);
    }
  };

  render() {
    const { formattedValue } = this;
    const {
      className,
      defaultValue,
      format,
      groupLengths,
      inputRef,
      onChange,
      replacementCharacter,
      value,
      ...otherProps
    } = this.props;
    const { selectionStart } = this.state;

    return (
      <input
        type="text"
        {...otherProps}
        className={mergeClassNames(baseClassName, className)}
        inputMode="numeric"
        onChange={this.onChange}
        onTouchEnd={this.onTouchEnd}
        onTouchStart={this.onTouchStart}
        ref={mergeRefs(
          inputRef,
          (ref) => {
            if (!ref) {
              return;
            }

            this.input = ref;

            if (selectionStart !== null) {
              ref.setSelectionRange(selectionStart, selectionStart);
            }
          },
        )}
        value={formattedValue}
      />
    );
  }
}

SeparatedNumberInput.defaultProps = {
  replacementCharacter: '#',
};

const isValue = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
]);

SeparatedNumberInput.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  defaultValue: isValue,
  format: PropTypes.string,
  groupLengths: PropTypes.arrayOf(PropTypes.number),
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]),
  onChange: PropTypes.func,
  onTouchEnd: PropTypes.func,
  onTouchStart: PropTypes.func,
  pattern: PropTypes.string,
  replacementCharacter: PropTypes.string,
  value: isValue,
};
