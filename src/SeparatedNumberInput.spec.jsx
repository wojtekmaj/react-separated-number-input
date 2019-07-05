import React from 'react';
import { shallow } from 'enzyme';

import SeparatedNumberInput from './SeparatedNumberInput';

describe('<SeparatedNumberInput /> component', () => {
  const defaultProps = {
    groupLengths: [4, 4, 4, 4],
  };

  it('renders itself properly', () => {
    const component = shallow(
      <SeparatedNumberInput
        {...defaultProps}
      />,
    );

    expect(component.find('input')).toHaveLength(1);
  });

  it('renders itself properly with defaultValue', () => {
    const component = shallow(
      <SeparatedNumberInput
        {...defaultProps}
        defaultValue="123456"
      />,
    );

    const input = component.find('input');

    expect(input.prop('value')).toBe('1234 56');
  });

  it('renders itself properly with value', () => {
    const component = shallow(
      <SeparatedNumberInput
        {...defaultProps}
        value="123456"
      />,
    );

    const input = component.find('input');

    expect(input.prop('value')).toBe('1234 56');
  });

  it('updates & formats the value properly', () => {
    const value = '1234';
    const nextValue = '12345';

    const component = shallow(
      <SeparatedNumberInput
        {...defaultProps}
        defaultValue={value}
      />,
    );

    const input = component.find('input');

    const fakeEvent = {
      target: {
        value: nextValue,
        selectionStart: nextValue.length,
      },
    };
    input.simulate('change', fakeEvent);

    const input2 = component.find('input');

    expect(input2.prop('value')).toBe('1234 5');
  });

  it('calls onChange properly', () => {
    const onChange = jest.fn();

    const component = shallow(
      <SeparatedNumberInput
        {...defaultProps}
        onChange={onChange}
      />,
    );

    const input = component.find('input');

    const fakeEvent = {
      target: {
        value: '',
        selectionStart: null,
      },
    };
    input.simulate('change', fakeEvent);

    expect(onChange).toHaveBeenCalledWith(fakeEvent);
  });
});
