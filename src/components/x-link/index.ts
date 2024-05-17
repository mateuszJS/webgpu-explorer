import HEART from './index.heart'
import updateView from 'router/updateView';
import CSS from './styles.raw.scss'
import BaseElement from 'BaseElement';

BaseElement.attachCSS(CSS)

class XLink extends BaseElement {
  static observedAttributes = ["to"];

  get heart() {
    return HEART
  }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    if (name === 'to') {
      // this.querySelector('a')!.addEventListener('click', (e) => {
      //   e.preventDefault();
      //   window.history.pushState({}, newVal, window.location.origin + newVal);
      //   updateView(newVal)
      //   return false
      // })
    }
  }
}

window.customElements.define('x-link', XLink);
