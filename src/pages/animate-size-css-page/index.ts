import BaseElement from 'BaseElement'
import HEART from './index.heart'

class AnimateSizeCssPage extends BaseElement {
  get heart() {
    return HEART
  }
}

window.customElements.define('animate-size-css-page', AnimateSizeCssPage)
