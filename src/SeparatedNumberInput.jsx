import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { groupCharacters, removeNonNumericChars, sum } from './utils';

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

    onChange(event);
  }

  render() {
    const { formattedValue } = this;
    const {
      defaultValue,
      groupLengths,
      onChange,
      value,
      ...otherProps
    } = this.props;
    const { selectionStart } = this.state;

    return (
      <input
        type="text"
        {...otherProps}
        onChange={this.onChange}
        value={formattedValue}
        pattern="\d*"
        ref={(ref) => {
          if (!ref) {
            return;
          }

          if (selectionStart !== null) {
            ref.setSelectionRange(selectionStart, selectionStart);
          }
        }}
      />
    );
  }
}

SeparatedNumberInput.propTypes = {
  defaultValue: PropTypes.string,
  groupLengths: PropTypes.arrayOf(PropTypes.number).isRequired,
  onChange: PropTypes.func,
  value: PropTypes.string,
};
