import mountHTML from "./mountHTML"

export default class BaseElement extends HTMLElement {
  private mounted: boolean

  static attachCSS(source: string) {
    // we may also check if already doesn't exist, because of inital SSG HTML
    const style = document.createElement("style")
    style.textContent = source
    document.head.appendChild(style)
  }

  constructor() {
    super()
    this.mounted = false
  }

  get heart(): Heart { // abstract
    return {dynamics: [], html: '', listeners: []}
  }

  get debug() {
    return ''
  }

  afterRender(){} // abstract

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    if (!this.mounted) return
    // BaseElement.observedAttributes
    // think about optimization

    /*
    Proposal for the future:
    {
      selector: '.cbdf'
      inputs: ['a', 'b', 'c'] // remove!!!
      callback
      destAttr...
    }
    [{a: [array of dynamic dependand on a], b: [array of dynamic dependand on b]}]
    */
    this.heart.dynamics.forEach(dynamic => {
      if (dynamic.inputs.includes(name)) {
        this.updateDynamic(dynamic)
      }
    })
    if (this.debug) {
      console.log(this.debug, 'attributeChangedCallback', name, oldVal, newVal)
    }
  }


  updateDynamic = (dynamic: Dynamic) => {
    const sourceAttrValue = dynamic.sourceAttr(this)
      
    // split sourceAttr to dynamic and static part
    const node = this.querySelector<HTMLElement>(dynamic.selector)!
    if (dynamic.destAttr) {
      // attribute
      node.setAttribute(dynamic.destAttr, sourceAttrValue)
    } else {
      //innerText
      node.innerText = sourceAttrValue
    }
  }

  connectedCallback() {
    if (this.mounted) return // component content alreayd mounted
    // whe nwe call "appendChild" with a custom-element inside,
    // then that custom element calles connectedCallback again!

    if (this.debug) {
      console.log(this.debug, 'connectedCallback')
    }

    this.mounted = true

    const {dynamics, listeners, html} = this.heart

    mountHTML(this, html)

    dynamics.forEach(this.updateDynamic)

    listeners.forEach(listener => {
      const node = this.querySelector<HTMLElement>(listener.selector)!
      node.addEventListener(
        listener.event,
        this[listener.callback as keyof typeof this] as unknown as (this: HTMLElement, ev: Event) => void
      )
    })
    
    this.afterRender()
  }

  disconnectedCallback() {
    this.heart.listeners.forEach(listener => {
      const node = this.querySelector<HTMLElement>(listener.selector)!
      node.removeEventListener(
        listener.event,
        this[listener.callback as keyof typeof this] as unknown as (this: HTMLElement, ev: Event) => void
      )
    })
  }

  attr(attributeName: string) {
    return this.getAttribute(attributeName)!
  }
}
