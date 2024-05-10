import html from './index.inline.html'
import CSS from './styles.inline.css'

let tmpl = document.createElement('template');
tmpl.innerHTML = `<style>${CSS}</style>${html}`;

export default class ProjectStepper extends HTMLElement {
  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'closed'});
    shadowRoot.appendChild(tmpl.content.cloneNode(true));
  }

  // connectedCallback() {
  //   const node = tmpl.content.cloneNode(true)
  //   const children = Array.from(this.children).reverse()
  //   this.appendChild(node)

  //   const slot = this.querySelector('slot')!
  //   children.forEach(child => {
  //     slot.insertAdjacentElement('afterend', child)
  //   })
  //   slot.remove()
  // }
}

window.customElements.define('project-stepper', ProjectStepper);
