import BaseElement from 'BaseElement'
import HEART, {propsUsedInTemplate} from './index.heart'
import type { Nav, Base5Json } from 'content/types'

class BlogPostPage extends BaseElement {
  static observedUrlParams = ['projectSlug']
  static observedAttributes = propsUsedInTemplate
  // Page should somehow dubscribe to all dynamic params!!!!
  // Shoudl be automatically attach to the state!

  constructor() {
    super()

    const projectSlug = this.state.projectSlug

    fetch(require(`content/${projectSlug}/base.json5`))
      .then(res => res.json())
      .then((json: Nav) => {
        this.state.title = json.title
        this.state.navItems = json.nav
        this.state.tabs = json.files.toReversed() // we use reverse flex direction
        this.state.selectedFile ??= this.state.tabs[0]

        json.files.forEach(fileName => {
          fetch(require(`content/${projectSlug}/files/${fileName}.txt`))
            .then(res => res.text())
            .then(fileContent => {
              this.state.files = {
                ...this.state.files,
                [fileName]: fileContent,
              }
            })
        })
      })
  }

  get heart() {
    return HEART
  }

  // get debug() {
  //   return 'project-steps-page'
  // }
}

window.customElements.define('blog-post-page', BlogPostPage);
