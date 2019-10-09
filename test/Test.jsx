import React, { Component } from 'react';
import SeparatedNumberInput from 'react-separated-number-input/src/entry';

import './Test.less';

const initialValue = '12345678900';

export default class Test extends Component {
  state = {
    value: initialValue,
  }

  onChange = (event) => {
    this.setState({ value: event.target.value });
  }

  render() {
    const { value } = this.state;

    return (
      <div className="Test">
        <header>
          <h1>
            react-separated-number-input test page
          </h1>
        </header>
        <div className="Test__container">
          <aside className="Test__container__options" />
          <main className="Test__container__content">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                /* eslint-disable no-console */
                console.error('SeparatedNumberInput triggered submitting the form.');
                console.log(event);
                /* eslint-enable no-console */
              }}
            >
              <p>controlled:</p>
              <SeparatedNumberInput
                format="## ### ### ###"
                onChange={this.onChange}
                value={value}
              />
              <p>uncontrolled:</p>
              <SeparatedNumberInput
                defaultValue={initialValue}
                format="## ### ### ###"
                onChange={this.onChange}
              />
              <p>number with prefix</p>
              <SeparatedNumberInput
                defaultValue="12345678"
                format="(+1) #### ## ##"
              />
              <p>format with hash character</p>
              <SeparatedNumberInput
                defaultValue="345"
                format="#000"
                replacementCharacter="0"
              />
              <p>With pattern:</p>
              <SeparatedNumberInput
                defaultValue={initialValue}
                groupLengths={[2, 3, 3, 3]}
                pattern="^[0-9]{2} [0-9]{3} [0-9]{3} [0-9]{3}$"
              />
              <br />
              <br />
              <button
                id="submit"
                type="submit"
              >
                Submit
              </button>
            </form>
          </main>
        </div>
      </div>
    );
  }
}
