import React, { useState } from 'react';
import SeparatedNumberInput from 'react-separated-number-input';

import './Sample.less';

export default function Sample() {
  const [value, setValue] = useState('');

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
            onChange={onChange}
            groupLengths={[4, 4, 4, 4]}
            value={value}
          />
        </main>
      </div>
    </div>
  );
}
