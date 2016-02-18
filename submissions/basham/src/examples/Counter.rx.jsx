import React from 'react';
import {Component, FuncSubject} from 'rx-react';
import Rx from 'rx';

function events() {
  return {
    decrementButtonClicked: FuncSubject.create(),
    incrementButtonClicked: FuncSubject.create()
  }
}

function intent(events) {
  return {
    decrement$: events.decrementButtonClicked
      // Add `-1`.
      .map((event) => -1),
    increment$: events.incrementButtonClicked
      // Add `+1`.
      .map((event) => +1)
  }
}

function model(actions) {
  return Rx.Observable
    // Merge all `-1` and `+1` values into one stream.
    .merge(
      actions.decrement$,
      actions.increment$
    )
    // Sum all values.
    .scan((total, x) => total + x)
    // Start with displaying a count of `0`.
    .startWith(0)
    // Create state object.
    .map((count) => ({count}))
}

function view(state, events) {
  return (
    <div>
      <p>Count: {state.count}</p>
      <button
        onClick={events.incrementButtonClicked}
        type="button">
        +
      </button>
      <button
        onClick={events.decrementButtonClicked}
        type="button">
        -
      </button>
    </div>
  );
}

export default class CounterRxExample extends Component {
  componentDidMount() {
console.log('+++ Mounted');
  }
  componentDidUpdate(prevProps, prevState) {
    console.log('**', prevState, this.state)
  }
  getStateStream() {
        console.log('+++', this);
    this.events = events();
    const actions = intent(this.events);
    const state$ = model(actions);
    return state$;
  }
  render() {
    return view(this.state, this.events);
  }
}
