import HEART from './index.heart'
import updateView, { getPage } from 'router/updateView';
import BaseElement from 'BaseElement';
import CSS from './styles.css';
import importPage from 'router/importsMap';

BaseElement.attachCSS(CSS)

class XLink extends BaseElement {
  static observedAttributes = ["to"];

  get heart() {
    return HEART
  }

  onChangeTo(_oldVal: string, newVal: string): void {
    if (newVal === null) return // attribute 'to' can be set in dynamic way also
    const page = getPage(newVal)
    importPage(page)
  }

  handleRedirect = (e: MouseEvent) => {
    e.preventDefault();
    const to = this.attr('to')
    window.history.pushState({}, to, window.location.origin + to);
    
    const page = getPage(to)
    updateView(page)

    return false
  }

  // get debug() {
  //   return 'x-link'
  // }
}

window.customElements.define('x-link', XLink);
