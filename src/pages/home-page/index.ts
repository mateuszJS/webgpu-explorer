import BaseElement from 'BaseElement';
import HEART from './index.heart'
import CSS from './styles.css'
import projectsList from './projects-list.json'

BaseElement.attachCSS(CSS)

class HomePage extends BaseElement {
  constructor() {
    super()
    this.state.project_list = projectsList
  }

  get heart() {
    return HEART
  }
}

window.customElements.define('home-page', HomePage);
