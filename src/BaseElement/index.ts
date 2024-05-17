import mountHTML from "./mountHTML"

export default class BaseElement extends HTMLElement {
  static attachCSS(source: string) {
    const style = document.createElement("style")
    style.textContent = source
    document.head.appendChild(style)
  }

  constructor() {
    super()
  }

  get heart(): Heart { // abstract
    return {dynamics: [], html: ''}
  }

  afterRender(){} // abstract

  connectedCallback() {
    const {dynamics, html} = this.heart

    mountHTML(this, html)

    dynamics.forEach(dynamic => {
      const sourceAttrValue = dynamic.sourceAttr(this)
      
      // split sourceAttr to dynamic and static part

      if (dynamic.destAttr) {
        // attribute
        this.querySelector<HTMLElement>(dynamic.selector)!.setAttribute(dynamic.destAttr, sourceAttrValue)
      } else {
        //innerText
        this.querySelector<HTMLElement>(dynamic.selector)!.innerText = sourceAttrValue
      }
    })
    
    this.afterRender()
  }

  setText(selector: string, content: string) {
    return (this.querySelector(selector)! as HTMLElement).innerText = content
  }

  setAttr(selector: string, attributeName: string, value: string) {
    return (this.querySelector(selector)! as HTMLElement).setAttribute(attributeName, value)
  }

  attr(attributeName: string) {
    return this.getAttribute(attributeName)!
  }
}
