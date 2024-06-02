import BaseElement from 'BaseElement'
import HEART from './index.heart'
import CSS from './styles.css'
import type { Base5Json } from 'content/types'

BaseElement.attachCSS(CSS)

class ProjectOverviewPage extends BaseElement {
  get heart() {
    return HEART
  }

  afterRender(hydration: boolean): void {
    const [_, _page, projectSlug] = window.location.pathname.split('/')

    import(`content/${projectSlug}/base.json5`).then((module: Base5Json) => {
      this.state.title = module.default.title
      this.state.description = module.default.descriptionLong
      this.state.nav_items = module.default.nav
    })
  }
}

window.customElements.define('project-overview-page', ProjectOverviewPage);
