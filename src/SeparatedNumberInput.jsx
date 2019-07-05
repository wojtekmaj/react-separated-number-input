import React, { Component } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';

import { groupCharacters, removeNonNumericChars, sum } from './utils';

const baseClassName = 'react-separated-number-input';

const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

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

  get formattedValue() {
    const { value } = this;
    const { groupLengths } = this.props;
    const valueNumbersOnly = removeNonNumericChars(value);
    const valueGroup = groupCharacters(valueNumbersOnly, groupLengths);
    const formattedValue = valueGroup.join(' ');
    return formattedValue;
  }

  onChange = (event) => {
    const { groupLengths, onChange } = this.props;
    const { selectionStart, value } = event.target;

    const adjustedSelectionStart = (() => {
      if (selectionStart === value.length) {
        // User's cursor is at the end of input - no alignments necessary
        return null;
      }

      const isCaretAfterSeparator = groupLengths.some((groupLength, index) => {
        const separatorCount = index + 1;
        const totalGroupLengthSoFar = sum(groupLengths.slice(0, separatorCount));
        return totalGroupLengthSoFar + separatorCount === selectionStart;
      });

      const offset = this.formattedValue.length <= value.length ? 1 : -1;

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
    const { onTouchEnd } = this.props;

    if (iOS) {
      requestAnimationFrame(() => {
        this.input.removeAttribute('pattern');
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
      groupLengths,
      onChange,
      pattern, // eslint-disable-line react/prop-types
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
        onTouchStart={this.onTouchStart}
        onTouchEnd={this.onTouchEnd}
        value={formattedValue}
        ref={(ref) => {
          if (!ref) {
            return;
          }

          this.input = ref;

          if (selectionStart !== null) {
            ref.setSelectionRange(selectionStart, selectionStart);
          }
        }}
      />
    );
  }
}

SeparatedNumberInput.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  defaultValue: PropTypes.string,
  groupLengths: PropTypes.arrayOf(PropTypes.number).isRequired,
  onChange: PropTypes.func,
  onTouchEnd: PropTypes.func,
  onTouchStart: PropTypes.func,
  value: PropTypes.string,
};
