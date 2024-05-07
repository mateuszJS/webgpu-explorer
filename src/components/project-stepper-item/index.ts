import html from './index.inline.html'
import './styles.scss'

const tmpl = document.createElement('template');
tmpl.innerHTML = `${html}`;
// tmpl.innerHTML = `<style>${css}</style>${html}`;

export default class ProjectStepperItem extends HTMLElement {
  constructor() {
    super()

    // attachInternalLink(
    //   shadowRoot.querySelector('a')!,
    //   `/projects/${this.getAttribute('project-slug')}`
    // )
    // shadowRoot.querySelector('img')!.setAttribute('src', MAP_IMG_SRC[this.getAttribute('icon') as keyof typeof MAP_IMG_SRC])
    // shadowRoot.querySelector('h3')!.innerText = this.getAttribute('title') as string
    // shadowRoot.querySelector('p')!.innerText = this.getAttribute('text') as string
  }

  connectedCallback() {
    this.appendChild(tmpl.content.cloneNode(true));

    this.querySelector('.number')!.innerHTML = this.getAttribute('number')!
    this.querySelector('.title')!.innerHTML = this.getAttribute('title')!
    this.querySelector('.details p')!.innerHTML = this.getAttribute('details')!
  }

  // attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
  //   console.log(attrName, oldVal, newVal)
  //   if (oldVal !== newVal) {

  //   }
  // }
}

window.customElements.define('project-stepper-item', ProjectStepperItem);
