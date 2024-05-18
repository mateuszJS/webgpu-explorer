import BaseElement from 'BaseElement';
import HEART from './index.heart'

class HomeLink extends BaseElement {
  get heart() {
    return HEART
  }
}

window.customElements.define('home-link', HomeLink);
