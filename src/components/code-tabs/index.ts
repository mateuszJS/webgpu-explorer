import BaseElement from "BaseElement";
import CSS from './index.css'
import HEART from './index.heart'
import tabSideSvg from './tab-side.inline.svg'

BaseElement.attachCSS(CSS)

class CodeTabs extends BaseElement {
  static observedAttributes = ["tabs"]

  get heart() {
    return HEART
  }

  onChange_tabs(tabs?: string[]) {
    if (!tabs) return
    const ulNode = this.querySelector('ul')!

    const html = tabs.map(tab => {
      const href = `${window.location.pathname}?file=${tab}`
      return `<li><x-link to="${href}">${tabSideSvg}<span>${tab}</span>${tabSideSvg}</x-link></li>`
    }).join('')

    ulNode.innerHTML = html
  }
}

customElements.define('code-tabs', CodeTabs);
