import BaseElement from 'BaseElement'
import HEART, {propsUsedInTemplate} from './index.heart'
import CSS from './styles.css'
import { Nav } from 'content/types'
// import type { Base5Json } from 'content/types'

BaseElement.attachCSS(CSS)

class ProjectOverviewPage extends BaseElement {
  static observedAttributes = propsUsedInTemplate
  static observedUrlParams = ['projectSlug']

  constructor() {
    super()

    fetch(require(`content/${this.state.projectSlug}/base.json5`))
      .then(res => res.json())
      .then((json: Nav) => {
        this.state.title = json.title
        this.state.description = json.descriptionLong
        this.state.navItems = json.nav
      })
  }

  get heart() {
    return HEART
  }
}

window.customElements.define('project-overview-page', ProjectOverviewPage);
