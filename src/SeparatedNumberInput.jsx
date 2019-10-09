import React, { Component } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';

import {
  formatValue,
  groupLengthsToFormat,
  removeNonNumericChars,
} from './utils';

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

  get format() {
    const { format, groupLengths } = this.props;

    return format || groupLengthsToFormat(groupLengths);
  }

  get value() {
    // eslint-disable-next-line react/destructuring-assignment
    return this.isControlled ? this.props.value : this.state.value;
  }

  get formattedValue() {
    const { format, value } = this;
    const valueNumbersOnly = removeNonNumericChars(value);
    return formatValue(valueNumbersOnly, format);
  }

  onChange = (event) => {
    const { formattedValue } = this;
    const { onChange } = this.props;
    const { selectionStart, value } = event.target;

    const adjustedSelectionStart = (() => {
      if (selectionStart === value.length) {
        // User's cursor is at the end of input - no alignments necessary
        return null;
      }

      const characterAdded = formattedValue ? formattedValue.length <= value.length : true;
      const isCaretAfterSeparator = value[characterAdded ? selectionStart : selectionStart - 1] === ' ';

      const offset = (formattedValue && formattedValue.length <= value.length) ? 1 : -1;

      return isCaretAfterSeparator ? selectionStart + offset : selectionStart;
    })();

    this.setState({
      selectionStart: adjustedSelectionStart,
      value,
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
  value: isValue,
};
