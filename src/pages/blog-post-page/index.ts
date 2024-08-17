import BaseElement from 'BaseElement'
import HEART, {propsUsedInTemplate} from './index.heart'

class BlogPostPage extends BaseElement {
  static observedUrlParams = ['projectSlug']
  static observedAttributes = propsUsedInTemplate
  // Page should somehow dubscribe to all dynamic params!!!!
  // Shoudl be automatically attach to the state!

  constructor() {
    super()

    const projectSlug = this.state.projectSlug


  }

  get heart() {
    return HEART
  }

  // get debug() {
  //   return 'project-steps-page'
  // }
}

window.customElements.define('blog-post-page', BlogPostPage);
