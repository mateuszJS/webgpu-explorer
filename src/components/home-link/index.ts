import html from './index.inline.html'
import CSS from './styles.inline.css'

const tmpl = document.createElement('template');
tmpl.innerHTML = `<style>${CSS}</style>${html}`;

class HomeLink extends HTMLElement {
  constructor() {
    super()

    const shadowRoot = this.attachShadow({mode: 'closed'});
    shadowRoot.appendChild(tmpl.content.cloneNode(true));
  }
}

window.customElements.define('home-link', HomeLink);
