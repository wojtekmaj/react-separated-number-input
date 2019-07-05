import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { groupCharacters, removeNonNumericChars } from './utils';

export default class SeparatedNumberInput extends Component {
  state = {
    // eslint-disable-next-line react/destructuring-assignment
    value: this.props.defaultValue,
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
    const { onChange } = this.props;
    const { value } = event.target;
    this.setState({ value });
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

    return (
      <input
        type="text"
        {...otherProps}
        onChange={this.onChange}
        value={formattedValue}
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
