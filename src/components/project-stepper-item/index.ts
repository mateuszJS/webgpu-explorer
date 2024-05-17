import BaseElement from 'BaseElement';
import HEART from './index.heart'
import CSS from './styles.raw.scss'

BaseElement.attachCSS(CSS)

export default class ProjectStepperItem extends BaseElement {
  get heart() {
    return HEART
  }
}

window.customElements.define('project-stepper-item', ProjectStepperItem)
