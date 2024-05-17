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

  get html(): string { // abstract
    return ''
  }

  afterRender(){} // abstract

  connectedCallback() {
    const [dynamicsStr, htmlStr] = this.html.split('@@@')
    
    mountHTML(this, htmlStr)

    if(dynamicsStr) {
      dynamicsStr.split(',').forEach(text => {
        const [selector, sourceAttr, destAttr] = text.split('|')
        const sourceAttrValue = this.attr(sourceAttr)

        // split sourceAttr to dynamic and static part

        if (destAttr) {
          // attribute
          this.querySelector<HTMLElement>(selector)!.setAttribute(destAttr, sourceAttrValue)
        } else {
          //innerText
          this.querySelector<HTMLElement>(selector)!.innerText = sourceAttrValue
        }
      })
    }
    
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
