import HEART from './index.heart'
import './styles.scss'

import('components/code-block')
import("components/project-stepper")
import("components/project-stepper-item")

const tmpl = document.createElement('template');
tmpl.innerHTML = HEART.html;

class ProjectStepsPage extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.appendChild(tmpl.content.cloneNode(true))
  }
}

window.customElements.define('project-steps-page', ProjectStepsPage);
