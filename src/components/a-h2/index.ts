import BaseElement from 'BaseElement'
import CSS from './styles.css'
import HEART, { propsUsedInTemplate } from './index.heart'

BaseElement.attachCSS(CSS)

const regexAllSpaces = /\s+/g

class AH2 extends BaseElement {
  static observedAttributes = propsUsedInTemplate

  get heart() {
    return HEART
  }

  onChange_content(value: string | null) {
    if (value === null) return
    this.state.generatedId = value.toLowerCase().replace(regexAllSpaces, '-')
  }
}

window.customElements.define('a-h2', AH2)
