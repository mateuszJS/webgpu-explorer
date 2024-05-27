import BaseElement from 'BaseElement';
import HEART from './index.heart'
import CSS from './styles.css'

BaseElement.attachCSS(CSS)

class HomePage extends BaseElement {
  get heart() {
    return HEART
  }
}

window.customElements.define('home-page', HomePage);
