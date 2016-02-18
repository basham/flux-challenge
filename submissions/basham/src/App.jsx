import React, {Component} from 'react';

import CounterReactExample from './examples/Counter.rx';
import CounterRxExample from './examples/Counter.rx';

import FocusReactExample from './examples/Focus.react';
import FocusRxExample from './examples/Focus.rx';

import IntervalReactExample from './examples/Interval.react';
import IntervalRxExample from './examples/Interval.rx';

import LifecycleReactExample from './examples/Lifecycle.react';

import styles from './App.less';

export default class App extends Component {
  render() {
    return (
      <div className={styles.App}>
        <h1>RxJS Proof of Concept examples</h1>
        <h2>Counter (Rx)</h2>
        <CounterRxExample/>
        <h2>Counter (React)</h2>
        <CounterReactExample/>
        <h2>Focus (Rx)</h2>
        <FocusRxExample/>
        <h2>Focus (React)</h2>
        <FocusReactExample/>
        <h2>Interval (Rx)</h2>
        <IntervalRxExample/>
        <h2>Interval (React)</h2>
        <IntervalReactExample/>
        <h2>Lifecycle (React)</h2>
        <LifecycleReactExample/>
      </div>
    );
  }
}
