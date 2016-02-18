import React, {Component} from 'react';

export default class CounterReactExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
  render() {
    const {count} = this.state;
    return (
      <div>
        <p>Count: {count}</p>
        <button
          onClick={this.incrementButtonClicked.bind(this)}
          type="button">
          +
        </button>
        <button
          onClick={this.decrementButtonClicked.bind(this)}
          type="button">
          -
        </button>
      </div>
    );
  }
  decrementButtonClicked(event) {
    this.addToCounter(-1);
  }
  incrementButtonClicked(event) {
    this.addToCounter(+1);
  }
  addToCounter(value) {
    const count = this.state.count + value;
    this.setState({count});
  }
}
