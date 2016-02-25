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

function fetchSith(id) {
  const req = superagent
    .get(`${API_PATH}/dark-jedis/${id}`);
  return Rx.Observable
    .fromNodeCallback(req.end, req)()
}

function sithHTTP() {
  const request = FuncSubject.create();
  const response$ = request
    .startWith(DARTH_SIDIOUS_ID)
    .flatMap((id) => fetchSith(id));
  return {request, response$};
}

function model(planetResponse$, sithResponse$) {
  sithResponse$
    .subscribe(x => console.log('---', x));

  const planet$ = planetResponse$
    .map(({data}) => JSON.parse(data))
    .startWith(null);

  const initialSlots = Array
    .from({length: SLOT_COUNT})
    .map(() => null);

  const slots$ = sithResponse$
    .map(({body}) => body)
    .startWith(null)
    .scan(
      (list, sith) => {
        // Inject the initial sith in the middle of the list.
        if(list.every((s) => s === null)) {
          const entryIndex = Math.floor(SLOT_COUNT / 2);
          return list
            .map((s, index) => (index === entryIndex ? sith : s));
        }
        // Inject master sith in above their apprentice.
        const indexOfApprentice = list.findIndex((s) => s && s.master.id === sith.id);
        const indexAsMaster = indexOfApprentice - 1;
        if(indexAsMaster >= 0 && indexAsMaster < list.length - 1) {
          return list
            .map((s, index) => (index === indexAsMaster ? sith : s));
        }
        // Inject apprentice sith below their master.
        const indexOfMaster = list.findIndex((s) => s && s.apprentice.id === sith.id);
        const indexAsApprentice = indexOfMaster + 1;
        if(indexAsApprentice >= 1 && indexAsApprentice < list.length) {
          return list
            .map((s, index) => (index === indexAsApprentice ? sith : s));
        }
        // Return the original list if there's something amiss.
        return list;
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

function fetchMoreSith(slots$, request) {
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
        // Keep only sith ids that aren't already loaded
        // and when they would be loaded, they would fit in the list.
        .filter((id) => {
          const first = slots[0];
          const last = slots[slots.length - 1];
          // Is before the first item.
          const isMasterOfFirst = first && first.master.id === id;
          // Is after the last item.
          const isApprenticeOfLast = last && last.apprentice.id === id;
          // Is already loaded.
          const isSithInList = slots.findIndex((s) => s && s.id === id) !== -1;
          return !isMasterOfFirst && !isApprenticeOfLast && !isSithInList;
        })
    )
    .subscribe((id) => request(id))
}

export default class App extends Component {
  getStateStream() {
    const sith = sithHTTP();
    const planetResponse$ = fetchCurrentPlanet(WS_PATH);
    const {slots$, state$} = model(planetResponse$, sith.response$);
    fetchMoreSith(slots$, sith.request);
    return state$;
  }
  render() {
    return view(this.state);
  }
}
