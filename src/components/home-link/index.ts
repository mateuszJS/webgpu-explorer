import BaseElement from 'BaseElement';
import HTML from './index.inline2.html'
import CSS from './styles.raw.scss'

BaseElement.attachCSS(CSS)

class HomeLink extends BaseElement {
  get html() {
    return HTML
  }
}

window.customElements.define('home-link', HomeLink);
