import html from './index.inline.html'
import BaseComponent from 'BaseComponent';
import updateView from 'router/updateView';

const tmpl = document.createElement('template');
tmpl.innerHTML = html;

class InterLink extends BaseComponent {
  static observedAttributes = ["to"];

  constructor() {
    super(tmpl)

  }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    console.log(name, oldVal, newVal)

    if (name === 'to') {
      this.querySelector('a')!.addEventListener('click', () => {
        window.history.pushState({}, newVal, window.location.origin + newVal);
        updateView(newVal)
        return false
      })
    }
  }
}

window.customElements.define('inter-link', InterLink);
