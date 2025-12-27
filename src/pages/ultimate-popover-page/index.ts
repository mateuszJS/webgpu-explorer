import BaseElement from 'BaseElement'
import HEART from './index.heart'

class UltimatePopoverPage extends BaseElement {
  get heart() {
    return HEART
  }
}

window.customElements.define('ultimate-popover-page', UltimatePopoverPage);
