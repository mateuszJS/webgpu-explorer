import BaseElement from 'BaseElement';
import HEART from './index.heart'
import CSS from './styles.css'
import projectsList from './projects-list.json'

BaseElement.attachCSS(CSS)

class HomePage extends BaseElement {
  constructor() {
    super()
    this.state.projectList = projectsList
  }

  get heart() {
    console.log(this.state.projectList)
    return HEART
  }
}

window.customElements.define('home-page', HomePage);
