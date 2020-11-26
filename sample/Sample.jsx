import React, { useState } from 'react';
import SeparatedNumberInput from 'react-separated-number-input';

import './Sample.less';

export default function Sample() {
  const [value, setValue] = useState('1234567812345678');

  function onChange(event) {
    setValue(event.target.value);
  }

  return (
    <div className="Sample">
      <header>
        <h1>react-separated-number-input sample page</h1>
      </header>
      <div className="Sample__container">
        <main className="Sample__container__content">
          <SeparatedNumberInput
            groupLengths={[4, 4, 4, 4]}
            onChange={onChange}
            value={value}
          />
        </main>
      </div>
    </div>
  );
}
