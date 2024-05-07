import html from './index.inline.html'
import './styles.scss'

import('components/project-panel')

const tmpl = document.createElement('template');
tmpl.innerHTML = html;

class HomePage extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.appendChild(tmpl.content.cloneNode(true))
  }
}

window.customElements.define('home-page', HomePage);
