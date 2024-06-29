import BaseElement from 'BaseElement';
import HEART, { propsUsedInTemplate } from './index.heart'
import CSS from './styles.css'

BaseElement.attachCSS(CSS)

export default class ProjectNav extends BaseElement {
  static observedAttributes = [...propsUsedInTemplate, 'with-details']

  get heart() {
    return HEART
  }
}

window.customElements.define('project-nav', ProjectNav);
