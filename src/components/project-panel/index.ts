import startIcon from './icons/start-icon.png'
import triangleIcon from './icons/triangle-icon.png'
import html from './index.inline.html'
import CSS from "./styles.inline.css";

import('components/x-link')

const MAP_IMG_SRC = {
  background: startIcon,
  triangle: triangleIcon,
}

const tmpl = document.createElement('template');
tmpl.innerHTML = `<style>${CSS}</style>${html}`;

class ProjectPanel extends HTMLElement {
  constructor() {
    super()

    const shadow = this.attachShadow({mode: 'open'});
    shadow.appendChild(tmpl.content.cloneNode(true));

    shadow.querySelector('img')!.setAttribute('src', MAP_IMG_SRC[this.getAttribute('icon') as keyof typeof MAP_IMG_SRC])
    shadow.querySelector('h3')!.innerText = this.getAttribute('title') as string
    shadow.querySelector('p')!.innerText = this.getAttribute('text') as string
    shadow.querySelector('x-link')!.setAttribute(
      'to',
      `/projects/${this.getAttribute('project-slug')}`
    )
  }
}

window.customElements.define('project-panel', ProjectPanel);
