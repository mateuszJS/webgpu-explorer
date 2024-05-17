import BaseElement from 'BaseElement';
import html from './index.inline.html'
import CSS from './styles.raw.scss'

const tmpl = document.createElement('template')
tmpl.innerHTML = html

// BaseElement.attachCSS(CSS)

let timeA = 0
let timeB = 0
let countA = 0
let countB = 0

setTimeout(() => {
  console.log('innerHTML', timeA / countA)
  console.log('template + querySelector', timeB / countB)
}, 2000)

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
    // const shadow = this.attachShadow({mode: 'closed'});
    // shadow.appendChild(tmpl.content.cloneNode(true));
    const variant = this.getAttribute('variant')
    if (variant === 'A') {
      const start = performance.now()
      this.innerHTML = `<li>
        <span class="number">{this.getAttribute('order-number')!}</span>
        <h6>{this.getAttribute('headline')!}</h6>
        <div class="details">
          <p>{this.getAttribute('details')!}</p>
        </div>
      </li>`
      // this.innerHTML = `<li>
      //   <span class="number">${this.getAttribute('order-number')!}</span>
      //   <h6>${this.getAttribute('headline')!}</h6>
      //   <div class="details">
      //     <p>${this.getAttribute('details')!}</p>
      //   </div>
      // </li>`
      timeA += performance.now() - start
      countA++
    } else {
      const start = performance.now()
      const node = tmpl.content.cloneNode(true)
      this.appendChild(node) // attach content of the template
      // this.querySelector('h6')!.innerHTML = this.getAttribute('headline')!
      // this.querySelector('.details p')!.innerHTML = this.getAttribute('details')!
      // this.querySelector('.number')!.innerHTML = this.getAttribute('order-number')!
      timeB += performance.now() - start
      countB++
    }

  }
}

window.customElements.define('project-stepper-item', ProjectStepperItem);
