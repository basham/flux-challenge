import {Component, FuncSubject} from 'rx-react';
import Rx from 'rx';
import superagent from 'superagent';

import {view} from './App.view'

const WS_PATH = 'ws://localhost:4000';
const API_PATH = 'http://localhost:3000';
const DARTH_SIDIOUS_ID = 3616;
const SLOT_COUNT = 5;

function fetchCurrentPlanet(url) {
  const connection = new WebSocket(url);
  const ws = FuncSubject.create();
  connection.onerror = (err) => {
    //ws.onError(err);
  }
  connection.onmessage = (msg) => {
    //ws.onNext(msg);
    ws(msg);
  }
  return ws;
}

function fetchDarkJedi(id) {
  const req = superagent
    .get(`${API_PATH}/dark-jedis/${id}`);
  return Rx.Observable
    .fromNodeCallback(req.end, req)()
}

function darkJediHTTP() {
  const request = FuncSubject.create();
  const response$ = request
    .startWith(DARTH_SIDIOUS_ID)
    .flatMap((id) => fetchDarkJedi(id));
  return {request, response$};
}

function model(planetResponse$, darkJediResponse$) {
  darkJediResponse$
    .subscribe(x => console.log('---', x));

  const planet$ = planetResponse$
    .map(({data}) => JSON.parse(data))
    .startWith(null);

  const initialSlots = Array
    .from({length: SLOT_COUNT})
    .map(() => null);

  const slots$ = darkJediResponse$
    .map(({body}) => body)
    .startWith(null)
    .scan(
      (slots, darkJedi) => {
        // Inject the initial dark jedi in the middle of the slots.
        if(slots.every((slot) => slot === null)) {
          const entryIndex = Math.floor(SLOT_COUNT / 2);
          return slots
            .map((slot, index) => (index === entryIndex ? darkJedi : slot));
        }
        return slots;
      },
      initialSlots
    );

  const state$ = Rx.Observable
    .combineLatest(
      planet$,
      slots$,
      (planet, slots) => ({planet, slots})
    );

  return {slots$, state$};
}

function fetchMoreDarkJedi(slots$, request) {
  slots$
    // Loop through each slots.
    .flatMap((slots) =>
      slots
        // Find only slot items with content.
        .filter(sith => sith !== null)
        // Extract every apprentice and master combo into array.
        .map(({apprentice, master}) => [apprentice, master])
        // Flatten the array of arrays into a single array.
        .reduce((a, b) => a.concat(b), [])
        // Keep only the id of each sith.
        .map(({id}) => id)
    )
    //.subscribe((id) => request(id))
}

export default class App extends Component {
  getStateStream() {
    const darkJedi = darkJediHTTP();
    const planetResponse$ = fetchCurrentPlanet(WS_PATH);
    const {slots$, state$} = model(planetResponse$, darkJedi.response$);
    fetchMoreDarkJedi(slots$, darkJedi.request);
    return state$;
  }
  render() {
    return view(this.state);
  }
}
