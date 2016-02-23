import React from 'react';
import {Component, FuncSubject} from 'rx-react';
import Rx from 'rx';
import superagent from 'superagent';

import styles from './styles.css';

const WS_PATH = 'ws://localhost:4000';
const API_PATH = 'http://localhost:3000';
const DARTH_SIDIOUS_ID = 3616;

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

function model(planetResponse$, darkJedi$) {
  darkJedi$
    .subscribe(x => console.log('---', x));

  const planet$ = planetResponse$
    .map(({data}) => JSON.parse(data))
    .startWith(null);

  const slots$ = Rx.Observable
    .just([
      {name: 'Jorak Uln', homeworld: {name: 'Korriban'}, id: 0},
      {name: 'Skere Kaan', homeworld: {name: 'Coruscant'}, id: 1},
      {name: 'Na\'daz', homeworld: {name: 'Ryloth'}, id: 2},
      {name: 'Kas\'im', homeworld: {name: 'Nal Hutta'}, id: 3},
      {name: 'Darth Bane', homeworld: {name: 'Apatros'}, id: 4}
    ]);

  return Rx.Observable
    .combineLatest(
      planet$,
      slots$,
      (planet, slots) => ({planet, slots})
    );
}

function view(state) {
  return (
    <div className={styles['app-container']}>
      <div className={styles['css-root']}>
        <h1 className={styles['css-planet-monitor']}>
          {state.planet
            ? `Obi-Wan currently on ${state.planet.name}`
            : 'Searching...'
          }
        </h1>
        <section className={styles['css-scrollable-list']}>
          <ul className={styles['css-slots']}>
            {state.slots.map(renderSlot)}
          </ul>
          <div className={styles['css-scroll-buttons']}>
            <button className={styles['css-button-up']}></button>
            <button className={styles['css-button-down']}></button>
          </div>
        </section>
      </div>
    </div>
  );
}

function renderSlot({homeworld, id, name}) {
  return (
    <li
      className={styles['css-slot']}
      key={id}>
      <h3>{name}</h3>
      <h6>Homeworld: {homeworld.name}</h6>
    </li>
  )
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
