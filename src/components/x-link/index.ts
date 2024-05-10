import html from './index.inline.html'
import updateView from 'router/updateView';

const tmpl = document.createElement('template');
tmpl.innerHTML = html;

class XLink extends HTMLElement {
  private shadow: ShadowRoot

  static observedAttributes = ["to"];

  constructor() {
    super()
    this.shadow = this.attachShadow({mode: 'closed'});
    this.shadow.appendChild(tmpl.content.cloneNode(true));
  }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    console.log(name, oldVal, newVal)

    if (name === 'to') {
      this.shadow.querySelector('a')!.addEventListener('click', () => {
        window.history.pushState({}, newVal, window.location.origin + newVal);
        updateView(newVal)
        return false
      })
    }
  }
}

window.customElements.define('x-link', XLink);
