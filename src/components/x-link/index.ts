import HEART, {propsUsedInTemplate} from './index.heart'
import updateView, { getPage } from 'router/updateView';
import BaseElement from 'BaseElement';
import CSS from './styles.css';
import importPage from 'router/importsMap';
import { updatePathname } from 'router';

BaseElement.attachCSS(CSS)

class XLink extends BaseElement {
  static observedAttributes = propsUsedInTemplate;

  get heart() {
    return HEART
  }

  onChange_to(value: string): void {
    if (!value) return // attribute 'to' can be set in dynamic way also
    const page = getPage(value)
    importPage(page)
  }

  handleRedirect = (e: MouseEvent) => {
    e.preventDefault();
    const to = this.state.to

    window.history.pushState({}, to, window.location.origin + to);
    updatePathname(to)

    return false
  }

  // get debug() {
  //   return 'x-link'
  // }
}

window.customElements.define('x-link', XLink);
