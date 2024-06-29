import BaseElement from "BaseElement";
import CSS from './index.css'
import HEART, {propsUsedInTemplate} from './index.heart'
import tabSideSvg from './tab-side.inline.svg'

BaseElement.attachCSS(CSS)

class CodeTabs extends BaseElement {
  static observedAttributes = ["tabs", "on-change", ...propsUsedInTemplate]

  get heart() {
    console.log('HEART', HEART)
    return HEART
  }

  onTabClick = (e: Event, elWithListener: HTMLElement, additionalSource?: unknown) => {
    console.log('?   ', this.state, additionalSource)
    this.state.onChange(additionalSource)
  }

  onChange_tabs(tabs?: string[]) {
    if (!tabs) return
    // const ulNode = this.querySelector('ul')!

    // const html = tabs.map(tab => {
    //   const href = `${window.location.pathname}?file=${tab}`
    //   return `<li><x-button x-tab=${tab}>${tabSideSvg}<span>${tab}</span>${tabSideSvg}</x-button></li>`
    // }).join('')

    // TODO: chandle for loop rendering!!!!

    // ulNode.innerHTML = html
  }

  // this.state.on_change
}

customElements.define('code-tabs', CodeTabs);
