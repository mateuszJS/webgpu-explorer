import mountHTML from "./mountHTML"
import {restore} from 'complex-storage'

type State = Record<string, any>

export default class BaseElement extends HTMLElement {
  protected state: State

  static attachCSS(source: string) {
    // we may also check if already doesn't exist, because of inital SSG HTML
    const style = document.createElement("style")
    style.textContent = source
    document.head.appendChild(style)
  }

  constructor() {
    super()
    const handler = {
      set: (obj: State, prop: string, value: any) => {
        obj[prop] = value
        this.onStateChange(prop)
        return true
      }
    };

    const observedAttrs = (this.constructor as unknown as { observedAttributes?: string[] }).observedAttributes || []
    const attributesWeObserve = [...observedAttrs, 'mounted', 'hydration']

    this.state = new Proxy({}, handler)
    Array.from(this.attributes).forEach(attr => {
      if (attributesWeObserve.includes(attr.nodeName)) { // we don;t want to call callback when "class" is changign for example
        this.attributeChangedCallback(attr.nodeName, null, attr.nodeValue as string)
      }
      // how is it even posssible that this.attribute(NamedNodeMap) can have value null??
    })
  }

  get heart(): Heart { // abstract
    return {dynamics: [], html: '', listeners: []}
  }

  get debug() { // abstract
    return ''
  }

  afterRender(hydration: boolean){} // abstract

  attributeChangedCallback(name: string, _oldVal: string | null, newVal: string) {
    this.state[name] = newVal[0] === '#'
      ? restore(newVal)
      : newVal
  }

  onStateChange(name: string) {
    if (!this.state.mounted) return

    this.heart.dynamics.forEach(dynamic => {
      if (dynamic.inputs.includes(name)) {
        this.updateDynamic(dynamic)
      }
    })

    this.callOnChangeCallback(name)
  }

  callOnChangeCallback(propName: string) {
    const callbackName = 'onChange_' + propName as keyof typeof this
    (this[callbackName] as Function)?.(this.state[propName])
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

  private updateAllAttrs() { // called after mount/hydration
    // not sure if we need here a change to make it go thoug hwhole this.state? or just
    // as it is right now, obervedAttributes?
    const observedAttrs = (this.constructor as unknown as { observedAttributes?: string[] }).observedAttributes

    if (!observedAttrs) return

    observedAttrs.forEach(attr => {
      if (this.state[attr] !== undefined) {
        this.callOnChangeCallback(attr)
      }
    })
  }

  connectedCallback() {
    if (this.state.hydration) {
      this.state.hydration = false
      this.attachListeners()
      this.afterRender(true) // sometimes we depend on stuff from afterRender in reacting to attribute changes
      this.updateAllAttrs()
    }

    if (this.state.mounted) return // component content alreayd mounted
    // when we call "appendChild" with a custom-element inside,
    // then that custom element calles connectedCallback again!

    const {dynamics, html} = this.heart

    mountHTML(this, html)

    this.state.mounted = true

    dynamics.forEach(this.updateDynamic)
    this.attachListeners()
    this.afterRender(false) // sometimes we depend on stuff from afterRender in reacting to attribute changes
    this.updateAllAttrs()
  }

  private attachListeners() {
    this.heart.listeners.forEach(listener => {
      const node = this.querySelector<HTMLElement>(listener.selector)!
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
}
