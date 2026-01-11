import HEART, { propsUsedInTemplate } from './index.heart'
import { getPageDetails } from 'router/renderView'
import BaseElement from 'BaseElement'
import importPage from 'router/importsMap'
import { navigateUrl } from 'router'

class XLink extends BaseElement {
  static observedAttributes = propsUsedInTemplate

  get heart() {
    return HEART
  }

  onChange_to(value: string | null): void {
    if (!value || window.isSSG) return // attribute 'to' can be set in dynamic way also
    const page = getPageDetails(value).tagName
    importPage(page)
  }

  handleRedirect = (e: MouseEvent) => {
    e.preventDefault()
    navigateUrl(this.state.to as string)
    return false
  }

  // get debug() {
  //   return 'x-link'
  // }
}

window.customElements.define('x-link', XLink)
