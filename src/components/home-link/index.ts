import BaseElement from 'BaseElement'
import HEART from './index.heart'
import CSS from './styles.css'

BaseElement.attachCSS(CSS)

class HomeLink extends BaseElement {
  get heart() {
    return HEART
  }
}

window.customElements.define('home-link', HomeLink);
