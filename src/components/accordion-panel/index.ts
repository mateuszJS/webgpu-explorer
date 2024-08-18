import BaseElement from 'BaseElement';
import HEART, {propsUsedInTemplate} from './index.heart'
import CSS from "./styles.css";

BaseElement.attachCSS(CSS)

interface TransitionEventTarget extends EventTarget {
  parentNode: HTMLElement
}

class AccordionPanel extends BaseElement {
  static observedAttributes = propsUsedInTemplate

  private details: HTMLDetailsElement
  private duringTransition: boolean
  // what if we initialized them in constructor?
  // we assume those are always provided

  // maybe we should only mount on constructor, without mounting on connectedCallback
  // since we only allow declarative way of attaching dom?

  constructor() {
    super()
    this.duringTransition = false
    this.details = this.querySelector('details')!;
    this.classList.add('glass')
  }

  get heart(): Heart {
    return HEART
  }

  toggle(e: MouseEvent) {
    // Stop default behaviour from the browser
    e.preventDefault();
    
    if (this.duringTransition) return

    const isOpen = !this.details.open
    if (isOpen) {
      this.details.open = true
    }

    this.details.offsetLeft // just triggerring submit changes, reflow & repaint
    this.details.querySelector<HTMLElement>('.content')!.offsetLeft // reading from details was not always working....

    this.duringTransition = true

    if (isOpen) {
      this.details.classList.add('is-open')
    } else {
      this.details.classList.remove('is-open')
    }
  }

  endTransition(e: TransitionEvent) {
    const targetParentNode = (e.target as TransitionEventTarget).parentNode

    if (targetParentNode !== this.details) return
    this.duringTransition = false

    if (!this.details.classList.contains('is-open')) { // we assign open immidiately(to show HTML)
      // but to close we need to wait till the end of animation, and then HTML gets hidden
      this.details.open = false
    }
  }
}

window.customElements.define('accordion-panel', AccordionPanel);
