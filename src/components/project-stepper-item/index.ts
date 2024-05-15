import html from './index.inline.html'
import CSS from './styles.raw.scss'

const tmpl = document.createElement('template');
tmpl.innerHTML = `<style>${CSS}</style>${html}`;

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
    const shadow = this.attachShadow({mode: 'closed'});
    shadow.appendChild(tmpl.content.cloneNode(true));

    shadow.querySelector('h6')!.innerHTML = this.getAttribute('headline')!
    shadow.querySelector('.details p')!.innerHTML = this.getAttribute('details')!
    shadow.querySelector('.number')!.innerHTML = this.getAttribute('order-number')!
  }

  // attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
  //   console.log(attrName, oldVal, newVal)
  //   if (oldVal !== newVal) {

  //   }
  // }
}

window.customElements.define('project-stepper-item', ProjectStepperItem);
