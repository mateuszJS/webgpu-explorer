import html from './index.inline.html'
import './styles.scss'

import('components/code-block')

const tmpl = document.createElement('template');
tmpl.innerHTML = html;

class ProjectPage extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.appendChild(tmpl.content.cloneNode(true))
  }
}

window.customElements.define('project-page', ProjectPage);
