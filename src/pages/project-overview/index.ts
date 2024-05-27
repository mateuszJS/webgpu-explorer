import BaseElement from 'BaseElement'
import HEART from './index.heart'
import CSS from './styles.css'

BaseElement.attachCSS(CSS)

class ProjectOverviewPage extends BaseElement {
  get heart() {
    return HEART
  }
}

window.customElements.define('project-overview-page', ProjectOverviewPage);
