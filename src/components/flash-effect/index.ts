import BaseElement from 'BaseElement';
import HEART from './index.heart'
import CSS from './styles.css'

BaseElement.attachCSS(CSS)

class FlashEffect extends BaseElement {
  get heart() {
    return HEART
  }
}

window.customElements.define('flash-effect', FlashEffect);
