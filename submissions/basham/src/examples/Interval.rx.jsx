import React from 'react';
import {Component, FuncSubject} from 'rx-react';
import Rx from 'rx';

//
// DATA FLOW MODEL
//
// Reset button clicked.
// ------x-------x-----
//
// Start with initial "click".
// x-----x-------x-----
//
// Start interval for each event.
// 0-1-2-0-1-2-3-0-1-2-
//

function events() {
  return {
    resetButtonClicked: FuncSubject.create()
  }
}

function intent(events) {
  return {
    reset$: events.resetButtonClicked
      // Every reset triggers a `null` value,
      // since nothing more complicated is needed.
      .map((event) => null)
  }
}

function model(actions) {
  return actions.reset$
    // Autostart sequence.
    .startWith(null)
    // For every event, return a fresh observable that increments every second.
    // Ignore any previously created observables.
    .flatMapLatest((value, index) =>
      Rx.Observable
        // Increment every second.
        .interval(1000)
        // Start with an initial value.
        .startWith(0)
    )
    // Prepare the state object for rendering the view.
    .map((secondsElapsed) => ({secondsElapsed}));
}

function view(state, events) {
  return (
    <div>
      <p>Seconds Elapsed: {state.secondsElapsed}</p>
      <button
        onClick={events.resetButtonClicked}
        type="button">
        Reset
      </button>
    </div>
  );
}

export default class IntervalRxExample extends Component {
  getStateStream() {
    this.events = events();
    const actions = intent(this.events);
    const state$ = model(actions);
    return state$;
  }
  render() {
    return view(this.state, this.events);
  }
}
