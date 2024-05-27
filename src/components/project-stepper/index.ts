import BaseElement from 'BaseElement';
import HEART from './index.heart'
import CSS from './styles.css'

BaseElement.attachCSS(CSS)

export default class ProjectStepper extends BaseElement {
  get heart() {
    return HEART
  }
}

window.customElements.define('project-stepper', ProjectStepper);
