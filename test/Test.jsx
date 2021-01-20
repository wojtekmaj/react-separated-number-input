import React, { useState } from 'react';
import SeparatedNumberInput from 'react-separated-number-input/src/entry';

import './Test.less';

const initialValue = '12345678900';

export default function Test() {
  const [value, setValue] = useState(initialValue);

  function onChange(event) {
    setValue(event.target.value);
  }

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
            <p>Controlled:</p>
            <SeparatedNumberInput
              groupLengths={[2, 3, 3, 3]}
              onChange={onChange}
              value={value}
            />
            <p>Uncontrolled:</p>
            <SeparatedNumberInput
              defaultValue={initialValue}
              groupLengths={[2, 3, 3, 3]}
              onChange={onChange}
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
