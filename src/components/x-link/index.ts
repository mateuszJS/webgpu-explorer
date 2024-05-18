import HEART from './index.heart'
import updateView from 'router/updateView';
import BaseElement from 'BaseElement';

class XLink extends BaseElement {
  static observedAttributes = ["to"];

  get heart() {
    return HEART
  }

  handleRedirect = (e: MouseEvent) => {
    console.log('==========================')
    const to = this.attr('to')
    e.preventDefault();
    window.history.pushState({}, to, window.location.origin + to);
    updateView(to)
    return false
  }

  get debug() {
    return 'x-link'
  }
}

window.customElements.define('x-link', XLink);
