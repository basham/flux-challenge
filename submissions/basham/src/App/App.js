import {Component, FuncSubject} from 'rx-react';
import Rx from 'rx';
import superagent from 'superagent';

import {view} from './App.view'

const WS_PATH = 'ws://localhost:4000';
const API_PATH = 'http://localhost:3000';
const DARTH_SIDIOUS_ID = 3616;
const SLOT_COUNT = 5;

function currentPlanet(url) {
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

  return Rx.Observable
    .combineLatest(
      planet$,
      slots$,
      (planet, slots) => ({planet, slots})
    );
}

export default class App extends Component {
  getStateStream() {
    const fetch$ = Rx.Observable
      .just(DARTH_SIDIOUS_ID)
      .flatMap((id) => fetchDarkJedi(id))
    const planet$ = currentPlanet(WS_PATH);
    return model(planet$, fetch$);
  }
  render() {
    return view(this.state);
  }
}
