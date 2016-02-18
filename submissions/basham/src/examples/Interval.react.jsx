import React, {Component} from 'react';

export default class IntervalReactExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secondsElapsed: 0
    };
    this.start();
  }
  render() {
    const {secondsElapsed} = this.state;
    return (
      <div>
        <p>Seconds Elapsed: {secondsElapsed}</p>
        <button
          onClick={this.resetButtonClicked.bind(this)}
          type="button">
          Reset
        </button>
      </div>
    );
  }
  resetButtonClicked(event) {
    this.reset();
    this.start();
  }
  reset() {
    clearInterval(this.intervalId);
    this.setState({secondsElapsed: 0});
  }
  start() {
    this.intervalId = setInterval(
      function() {
        const secondsElapsed = this.state.secondsElapsed + 1;
        this.setState({secondsElapsed});
      }.bind(this),
      1000
    );
  }
}
