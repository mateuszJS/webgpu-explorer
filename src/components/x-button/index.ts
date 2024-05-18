import BaseElement from 'BaseElement';
import CSS from './styles.raw.scss'

BaseElement.attachCSS(CSS)

class XButton extends BaseElement {
  get heart() {
    const html = this.parentElement!.tagName === 'a'
      ? `<div><slot></slot></div>`
      : `<button><slot></slot></button>`
    return { dynamics: [], listeners: [], html }
  }
}

window.customElements.define('x-button', XButton);
