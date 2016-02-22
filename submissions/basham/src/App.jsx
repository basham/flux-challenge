import React from 'react';
import {Component, FuncSubject} from 'rx-react';
import Rx from 'rx';

import styles from './styles.css';

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

export default class App extends Component {
  componentDidMount() {
    this.currentPlanet$ = currentPlanet('ws://localhost:4000');
    this.currentPlanet$
      .map(({data}) => (JSON.parse(data)))
      .subscribe((data) => { console.log('Current Planet', data) });
  }
  render() {
    return (
      <div className={styles['app-container']}>
        <div className={styles['css-root']}>
          <h1 className={styles['css-planet-monitor']}>Obi-Wan currently on Tatooine</h1>
          <section className={styles['css-scrollable-list']}>
            <ul className={styles['css-slots']}>
              <li className={styles['css-slot']}>
                <h3>Jorak Uln</h3>
                <h6>Homeworld: Korriban</h6>
              </li>
              <li className={styles['css-slot']}>
                <h3>Skere Kaan</h3>
                <h6>Homeworld: Coruscant</h6>
              </li>
              <li className={styles['css-slot']}>
                <h3>Na'daz</h3>
                <h6>Homeworld: Ryloth</h6>
              </li>
              <li className={styles['css-slot']}>
                <h3>Kas'im</h3>
                <h6>Homeworld: Nal Hutta</h6>
              </li>
              <li className={styles['css-slot']}>
                <h3>Darth Bane</h3>
                <h6>Homeworld: Apatros</h6>
              </li>
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
}
