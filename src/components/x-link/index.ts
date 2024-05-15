import html from './index.inline.html'
import updateView from 'router/updateView';
import CSS from './styles.raw.scss'

const tmpl = document.createElement('template');
tmpl.innerHTML = `<style>${CSS}</style>${html}`;

class XLink extends HTMLElement {
  private anchorNode: HTMLAnchorElement

  static observedAttributes = ["to"];

  constructor() {
    super()
    const shadow = this.attachShadow({mode: 'closed'});
    shadow.appendChild(tmpl.content.cloneNode(true));
    this.anchorNode = shadow.querySelector('a')!
  }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    console.log(name, oldVal, newVal)

    if (name === 'to') {
      this.anchorNode.setAttribute('href', newVal)
      this.anchorNode.addEventListener('click', (e) => {
        e.preventDefault();
        window.history.pushState({}, newVal, window.location.origin + newVal);
        updateView(newVal)
        return false
      })
    }
  }
}

window.customElements.define('x-link', XLink);
