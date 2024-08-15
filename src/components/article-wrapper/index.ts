import BaseElement from 'BaseElement'
import HEART, {propsUsedInTemplate} from './index.heart'
import CSS from './styles.css'

BaseElement.attachCSS(CSS)

class ArticleWrapper extends BaseElement {
  static observedAttributes = propsUsedInTemplate

  get heart() {
    return HEART
  }
}

window.customElements.define('article-wrapper', ArticleWrapper);
