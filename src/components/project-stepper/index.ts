import BaseComponent from 'BaseComponent';
import html from './index.inline.html'

let tmpl = document.createElement('template');
tmpl.innerHTML = html;

export default class ProjectStepper extends BaseComponent {
  constructor() {
    super(tmpl)
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
