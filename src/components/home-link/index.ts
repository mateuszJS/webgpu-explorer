import BaseElement from 'BaseElement'
import HEART, {propsUsedInTemplate} from './index.heart'
import CSS from './styles.css'

BaseElement.attachCSS(CSS)

class HomeLink extends BaseElement {
  static observedAttributes = propsUsedInTemplate

  get heart() {
    return HEART
  }
}

window.customElements.define('home-link', HomeLink);
