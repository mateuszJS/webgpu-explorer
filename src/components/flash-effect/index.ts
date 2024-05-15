import html from './index.inline.html'
import CSS from './styles.raw.scss'

const tmpl = document.createElement('template');
tmpl.innerHTML = `<style>${CSS}</style>${html}`;

class FlashEffect extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({mode: 'closed'});
    shadow.appendChild(tmpl.content.cloneNode(true));
  }
}

window.customElements.define('flash-effect', FlashEffect);
