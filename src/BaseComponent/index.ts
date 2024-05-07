import mountHTML from "./mountHTML"

export default class BaseComponent extends HTMLElement {
  constructor(tmpl: HTMLTemplateElement) {
    super()
    mountHTML(this, tmpl)
  }

  connectedCallback() {
    
  }
}
