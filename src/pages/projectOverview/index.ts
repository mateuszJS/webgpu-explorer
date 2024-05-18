import BaseElement from 'BaseElement'
import HEART from './index.heart'
import './styles.scss'

import("components/project-stepper")
import("components/project-stepper-item")
import("components/x-button")
import("components/x-link")
import("components/home-link")

class ProjectOverviewPage extends BaseElement {
  get heart() {
    console.log(HEART)
    return HEART
  }
}

window.customElements.define('project-overview-page', ProjectOverviewPage);
