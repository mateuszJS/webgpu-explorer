import HEART from './index.heart'
import './styles.scss'

import('components/project-panel')

const tmpl = document.createElement('template');
tmpl.innerHTML = HEART.html;

class HomePage extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.appendChild(tmpl.content.cloneNode(true))
  }
}

window.customElements.define('home-page', HomePage);
