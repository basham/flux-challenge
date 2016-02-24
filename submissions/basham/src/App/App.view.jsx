import React from 'react';

import styles from './App.css';

export function view(state) {
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

let uuid = 0;

function getUniqueId() {
  return ++uuid;
}

function renderSlot(state) {
  const {homeworld, id = getUniqueId(), name = ''} = state || {};
  const key = `slot-${id}`;
  const homeworldName = homeworld && homeworld.name
    ? `Homeworld: ${homeworld.name}`
    : '';
  return (
    <li
      className={styles['css-slot']}
      key={key}>
      <h3>{name}</h3>
      <h6>{homeworldName}</h6>
    </li>
  )
}
