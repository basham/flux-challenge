import React, {Component} from 'react';

import styles from './styles.css';

export default class App extends Component {
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
