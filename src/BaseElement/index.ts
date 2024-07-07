import { subscribeUrl } from "router"
import mountHTML from "./mountHTML"
import {getStorage, setStorage} from 'complex-storage'
import { PageDetails } from "router/renderView"

type State = Record<string, any>
type EventHandler = (e: Event, elWithListener: HTMLElement, additionalSource?: unknown) => void

// all camelCaseToKebab is used in loader only
const kebabToCamelCase = (str: string) => str.replace(/-[a-z]/g, chars => chars[1].toUpperCase());

export default class BaseElement extends HTMLElement {
  public slotParentNode?: HTMLElement // used only in mountHTML
  public onChangeText?: VoidFunction // used only in mountHTML
  private unsubscribeUrl?: VoidFunction

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
    const attrsToSave = [...observedAttrs, 'mounted', 'hydration']

    this.state = new Proxy({}, handler)
    Array.from(this.attributes).forEach(attr => {
      if (attrsToSave.includes(attr.nodeName)) { // we don;t want to call callback when "class" is changign for example
        this.attributeChangedCallback(attr.nodeName, null, attr.nodeValue as string)
      }
      // how is it even posssible that this.attribute(NamedNodeMap) can have value null??
    })

    const observedUrlParams = (this.constructor as unknown as { observedUrlParams?: string[] }).observedUrlParams
    if (observedUrlParams) {
      this.unsubscribeUrl = subscribeUrl(this.onChangeUrlParams)
    }
  }


  // TODO: Handle multiple params changing,
  private onChangeUrlParams = (pageDetails: PageDetails) => {
    const observedUrlParams = (this.constructor as unknown as { observedUrlParams?: string[] }).observedUrlParams
    if (!observedUrlParams) return

    /*
      So this.state updates, 
    */
    observedUrlParams.forEach(paramName => {
      const value = pageDetails.params[paramName] || pageDetails.query?.[paramName]
      if (this.state[paramName] !== value) { // TODO: check if needed
        this.state[paramName] = value
      }
    })
  }

  get heart(): Heart { // abstract
    return {dynamics: [], html: '', listeners: []}
  }

  get debug() { // abstract
    return ''
  }

  afterRender(hydration: boolean){} // abstract

  attributeChangedCallback(kebabCaseName: string, _oldVal: string | null, newVal: string | null) {
    const name = kebabToCamelCase(kebabCaseName)
    this.state[name] = newVal?.[0] === '#'
      ? getStorage(newVal)
      : newVal
  }

  onStateChange(name: string) {
    if (!this.state.mounted) return
    // TODO, if we change multiple props, we call same dynamic multiple time
    // the following part should be called when JS stack is empty

    this.heart.dynamics.forEach(dynamic => {
      if (dynamic.inputs.includes(name)) {
        this.updateDynamic(dynamic)
      }
    })

    this.callOnChangeCallback(name)
  }

  callOnChangeCallback(propName: string) {
    const callbackName = 'onChange_' + propName as keyof typeof this
    ;(this[callbackName] as Function)?.(this.state[propName])
  }

  updateDynamicLoop = (dynamicLoop: Dynamic) => {
    const list = this.state[dynamicLoop.inputs[0]] as any[]
  }

  updateDynamic = (
    dynamic: Dynamic,
    nodeQueryScope: BaseElement | HTMLElement = this,
    additionalSource?: unknown,
  ) => {
    // TODO: doesn't work if x-for is on the same node as dynamics!
    // TODO: would be great to move it to just x-for case, not for every dynamic
    const node = (
      nodeQueryScope.matches(dynamic.selector)
        ? nodeQueryScope // only useful for loops
        : nodeQueryScope.querySelector<BaseElement | HTMLElement>(dynamic.selector)!
    ) as BaseElement | HTMLElement // WTF?

    if (dynamic.loop) {
      const list = this.state[dynamic.inputs[0]] as any[]
      // TODO: How do we recognize if list of other prop has changes???

      if (node.children.length > 0) {
        // TODO: supprot removing, replacing, adding
        const allItems = Array.from(node.children) as HTMLElement[] // not sure if it's the right assuption
        allItems.forEach((el, index) => {
          dynamic.loop!.dynamics.forEach(loopDynamic => this.updateDynamic(loopDynamic, el, list[index]))
        })
        // TODO: remove them also!!!!
        return
      }
      
      if (!list) return
      const html = list.reduce((acc, item) => {
        return acc + dynamic.loop!.html
        // Now we need to create a list with all dynamics, and just update them?
      }, '')
      node.innerHTML = html

      const allItems = Array.from(node.children) as HTMLElement[] // not sure if it's the right assuption
      allItems.forEach((el, index) => {
        dynamic.loop!.dynamics.forEach(loopDynamic => this.updateDynamic(loopDynamic, el, list[index]))
        this.attachListeners(dynamic.loop!.listeners, el, list[index])
      })
      // TODO: remove them also!!!!
      return
    }

    const sourceAttrValue = dynamic.sourceAttr(this, additionalSource)
    
    if (dynamic.destAttr) {
      if (dynamic.destAttr === 'x-if') {
        // we can remove but then we lose ability to reattach
        // maybe we should just replace it with <template> with h3t-selector???

        // And similar could be done with <slot> and x-for

        // or maybe just smart way ot locating those positions depending on paren and order level?
        // but that might be really difficuly

        // also what about x-if inside x-if??????
      }


      // attribute
      if (sourceAttrValue === null || sourceAttrValue === undefined) {
        node.removeAttribute(dynamic.destAttr)
        return
      }

      const value = typeof sourceAttrValue === 'string'
        ? sourceAttrValue
        : setStorage(sourceAttrValue)
      node.setAttribute(dynamic.destAttr, value)
    } else {
      if(this.debug) {
        console.log(dynamic)
      }

      // if we assign textContent before node is mounted, then we override slotParentNode?

      // textContent
      // TODO: check if that component is even mounted yet!
      if ('slotParentNode' in node) { // gives false
        node.slotParentNode!.textContent = sourceAttrValue
        if ('onChangeText' in node) { // gives false
          node.onChangeText?.()
        }
      } else {
        // it also works great becayse if node's component were not yet initialized
        // it's read innerHTML later and reattach
        node.textContent = sourceAttrValue
      }
    }
  }

  private callAllOnChangeCallbacks() {
    Object.keys(this.state).forEach(name => {
      this.callOnChangeCallback(name)
    })
  }

  connectedCallback() {
    if (!this.state.mounted) {
      const {dynamics, html} = this.heart
      mountHTML(this, html)
      dynamics.forEach(dynamic => this.updateDynamic(dynamic))
      // do we need this dynamic.forEach if we do "this.updateAllAttrs()" below?

      // when we call "appendChild" with a custom-element inside,
      // then that custom element calles connectedCallback again!
    }

    // TODO: why is mounted and hydration part of state??? I think it should be private property

    if (!this.state.mounted || this.state.hydration) {
      // How about complex storage while hydrating?
      this.state.mounted = true
      this.attachListeners(this.heart.listeners)
      this.afterRender(!!this.state.hydration) // sometimes we depend on stuff from afterRender in reacting to attribute changes
      this.state.hydration = false
      this.callAllOnChangeCallbacks()
    }
  }

  /**
   * @param querySelectScope useful only for x-for to limit search for paritcular item
   * @param additionalSource useful only for x-for to provide specific item data
   */
  private attachListeners(
    listeners: Listener[],
    querySelectScope: HTMLElement = this,
    additionalSource?: unknown
  ) {
    // 99% of the complication of this fuction comes from x-for directive
    const baseElementContext = this
    listeners.forEach(listener => {
      const node = (
        querySelectScope.matches(listener.selector)
          ? querySelectScope // only useful for loops
          : querySelectScope.querySelector<BaseElement | HTMLElement>(listener.selector)!
      ) as BaseElement | HTMLElement // WTF?

      // const node = querySelectScope.querySelector<HTMLElement>(listener.selector)!

      node.addEventListener(listener.event, function(this: HTMLElement, event) {
        (baseElementContext[listener.callback as keyof typeof baseElementContext] as unknown as EventHandler)(event, this, additionalSource)
      })
    })
  }

  disconnectedCallback() {
    this.unsubscribeUrl?.()
  }
}
