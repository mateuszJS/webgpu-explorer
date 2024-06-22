import BaseElement from 'BaseElement'
import HEART from './index.heart'
import CSS from './styles.css'
import { Nav } from 'content/types'
// import type { Base5Json } from 'content/types'

BaseElement.attachCSS(CSS)

class ProjectOverviewPage extends BaseElement {
  get heart() {
    return HEART
  }

  afterRender(hydration: boolean): void {
    const [_, _page, projectSlug] = window.location.pathname.split('/')

    fetch(require(`content/${projectSlug}/base.json5`))
      .then(res => res.json())
      .then((json: Nav) => {
        this.state.title = json.title
        this.state.description = json.descriptionLong
        this.state.nav_items = json.nav
      })
  }
}

window.customElements.define('project-overview-page', ProjectOverviewPage);
