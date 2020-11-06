import React, { Component } from 'react';
import SeparatedNumberInput from 'react-separated-number-input';

import './Sample.less';

export default class Sample extends Component {
  state = {
    value: '1234567812345678',
  }

  onChange = (event) => this.setState({ value: event.target.value })

  render() {
    const { value } = this.state;

    return (
      <div className="Sample">
        <header>
          <h1>react-separated-number-input sample page</h1>
        </header>
        <div className="Sample__container">
          <main className="Sample__container__content">
            <SeparatedNumberInput
              groupLengths={[4, 4, 4, 4]}
              onChange={this.onChange}
              value={value}
            />
          </main>
        </div>
      </div>
    );
  }
}
