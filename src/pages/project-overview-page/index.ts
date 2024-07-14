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

  afterMount(hydration: boolean): void {
    // TODO: get params from state, not read directly from url
    const [_, _page, projectSlug] = window.location.pathname.split('/')

    fetch(require(`content/${projectSlug}/base.json5`))
      .then(res => res.json())
      .then((json: Nav) => {
        this.state.title = json.title
        this.state.description = json.descriptionLong
        this.state.navItems = json.nav
      })
  }
}

window.customElements.define('project-overview-page', ProjectOverviewPage);
