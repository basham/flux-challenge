import React, {Component} from 'react';

export default class FocusReactExample extends Component {
  render() {
    return (
      <div>
        <button
          ref={this.buttonMounted.bind(this)}
          type="button">
          Button
        </button>
        <button
          onClick={this.switchFocusButtonClicked.bind(this)}
          type="button">
          Switch focus
        </button>
      </div>
    );
  }
  buttonMounted(ref) {
    this.buttonRef = ref;
  }
  switchFocusButtonClicked(event) {
    if(this.buttonRef) {
      this.buttonRef.focus();
    }
  }
}
