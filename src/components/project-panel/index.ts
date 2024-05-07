import startIcon from './icons/start-icon.png'
import triangleIcon from './icons/triangle-icon.png'
import html from './index.inline.html'
import './styles.scss'
import BaseComponent from 'BaseComponent';

import('components/inter-link')

const MAP_IMG_SRC = {
  background: startIcon,
  triangle: triangleIcon,
}

const tmpl = document.createElement('template');
tmpl.innerHTML = html;

class ProjectPanel extends BaseComponent {
  constructor() {
    super(tmpl)

    this.querySelector('img')!.setAttribute('src', MAP_IMG_SRC[this.getAttribute('icon') as keyof typeof MAP_IMG_SRC])
    this.querySelector('h3')!.innerText = this.getAttribute('title') as string
    this.querySelector('p')!.innerText = this.getAttribute('text') as string
    this.querySelector('inter-link')!.setAttribute(
      'to',
      `/projects/${this.getAttribute('project-slug')}`
    )
  }
}

window.customElements.define('project-panel', ProjectPanel);
