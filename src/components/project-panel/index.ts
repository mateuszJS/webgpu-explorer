import attachInternalLink from 'router/attachInternalLink';
import startIcon from './icons/start-icon.png'
import triangleIcon from './icons/triangle-icon.png'
import html from './index.inline.html'

const MAP_IMG_SRC = {
  background: startIcon,
  triangle: triangleIcon,
}

let tmpl = document.createElement('template');
tmpl.innerHTML = html;

class ProjectPanel extends HTMLElement {
  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'});

    shadowRoot.appendChild(tmpl.content.cloneNode(true));
    attachInternalLink(
      shadowRoot.querySelector('a')!,
      `/projects/${this.getAttribute('project-slug')}`
    )
    shadowRoot.querySelector('img')!.setAttribute('src', MAP_IMG_SRC[this.getAttribute('icon') as keyof typeof MAP_IMG_SRC])
    shadowRoot.querySelector('h3')!.innerText = this.getAttribute('title') as string
    shadowRoot.querySelector('p')!.innerText = this.getAttribute('text') as string
  }
}

window.customElements.define('project-panel', ProjectPanel);
