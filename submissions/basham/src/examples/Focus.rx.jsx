import React, {Component} from 'react';
import {FuncSubject} from 'rx-react';
import Rx from 'rx';

function events() {
  return {
    switchFocusButtonClicked: FuncSubject.create()
  }
}

function refs() {
  return {
    button: FuncSubject.create()
  }
}

function intent(events) {
  return {
    switchFocus$: events.switchFocusButtonClicked
      .map((event) => null)
  }
}

function model(actions, refs) {
  Rx.Observable
    .combineLatest(
      actions.switchFocus$,
      refs.button,
      (switchFocus, buttonRef) => buttonRef
    )
    .subscribe((ref) => ref.focus());
}

function view(events, refs) {
  return (
    <div>
      <button
        ref={refs.button}
        type="button">
        Button
      </button>
      <button
        onClick={events.switchFocusButtonClicked}
        type="button">
        Switch focus
      </button>
    </div>
  );
}

export default class FocusRxExample extends Component {
  constructor(props) {
    super(props);
    this.events = events();
    this._refs = refs();
    const actions = intent(this.events);
    const state$ = model(actions, this._refs);
  }
  render() {
    return view(this.events, this._refs);
  }
}
