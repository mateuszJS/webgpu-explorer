import BaseElement from 'BaseElement';
import HEART, {propsUsedInTemplate} from './index.heart'
import CSS from "./styles.css";

BaseElement.attachCSS(CSS)

class AccordionPanel extends BaseElement {
  static observedAttributes = propsUsedInTemplate

  get heart(): Heart {
    return HEART
  }
}

window.customElements.define('accordion-panel', AccordionPanel);
