import { attrOnChangeCallbackName } from "./attrNames"
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
    this.mounted = !!this.attr('mounted')
  }

  get heart(): Heart { // abstract
    return {dynamics: [], html: '', listeners: []}
  }

  get debug() {
    return ''
  }

  afterRender(hydration: boolean){} // abstract

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    if (!this.mounted) return

    this.heart.dynamics.forEach(dynamic => {
      if (dynamic.inputs.includes(name)) {
        this.updateDynamic(dynamic)
      }
    })

    const callbackName = attrOnChangeCallbackName(name) as keyof typeof this
    (this[callbackName] as Function)?.(oldVal, newVal)
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

  private updateAllAttrs() {
    const observedAttrs = (this.constructor as unknown as { observedAttributes?: string[] }).observedAttributes

    if (!observedAttrs) return

    observedAttrs.forEach(attr => {
      const callbackName = attrOnChangeCallbackName(attr) as keyof typeof this
      (this[callbackName] as Function)?.(null, this.attr(attr))
    })
  }

  connectedCallback() {
    if (this.attr('hydration')) {
      this.removeAttribute('hydration')

      this.attachListeners()
      this.updateAllAttrs()
      this.afterRender(true)
    }

    if (this.mounted) return // component content alreayd mounted
    // when we call "appendChild" with a custom-element inside,
    // then that custom element calles connectedCallback again!

    

    const {dynamics, html} = this.heart

    mountHTML(this, html)

    this.mounted = true
    this.setAttribute('mounted', 'true')

    dynamics.forEach(this.updateDynamic)
    this.attachListeners()
    this.updateAllAttrs()
    this.afterRender(false)
  }

  private attachListeners() {
    this.heart.listeners.forEach(listener => {
      const node = this.querySelector<HTMLElement>(listener.selector)!
      console.log(node)
      node.addEventListener(
        listener.event,
        this[listener.callback as keyof typeof this] as unknown as (this: HTMLElement, ev: Event) => void
      )
    })
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
