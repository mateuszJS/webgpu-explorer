import html from './index.inline.html'
import './styles.scss'

import("components/project-stepper")
import("components/project-stepper-item")

const tmpl = document.createElement('template');
tmpl.innerHTML = html;

class ProjectStepPage extends HTMLElement {
  constructor() {
    super()
    // const shadowRoot = this.attachShadow({mode: 'open'});
    // shadowRoot.appendChild(tmpl.content.cloneNode(true));

    // shadowRoot.appendChild();
    // attachInternalLink(
    //   shadowRoot.querySelector('a')!,
    //   `/projects/${this.getAttribute('project-slug')}`
    // )
    // shadowRoot.querySelector('img')!.setAttribute('src', MAP_IMG_SRC[this.getAttribute('icon') as keyof typeof MAP_IMG_SRC])
    // shadowRoot.querySelector('h3')!.innerText = this.getAttribute('title') as string
    // shadowRoot.querySelector('p')!.innerText = this.getAttribute('text') as string

    // this.querySelector<ProjectStepper>('project-stepper')!.data =  { x : 1}
  }

  connectedCallback() {
    this.appendChild(tmpl.content.cloneNode(true))

    // setTimeout(() => {
    // console.log(stepper._data, stepper.data2)
    // console.log(stepper, stepper.data2, stepper.constructor.prototype)
    // stepper.data2 =  { x : 1}
    // stepper.setAttribute('data2', 'xydnv')
    // stepper.attributes.set()
  // }, 10)
  }
}

window.customElements.define('project-step-page', ProjectStepPage);
