import BaseElement from 'BaseElement';
import HTML from './index.inline2.html'
import CSS from './styles.raw.scss'

BaseElement.attachCSS(CSS)

export default class ProjectStepper extends BaseElement {
  get html() {
    return HTML
  }
}

window.customElements.define('project-stepper', ProjectStepper);
