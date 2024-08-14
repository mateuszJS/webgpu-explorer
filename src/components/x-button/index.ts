import BaseElement from 'BaseElement';
import CSS from './styles.css'
import HEART from './index.heart'

BaseElement.attachCSS(CSS)

class XButton extends BaseElement {
  private dynamicHeart?: Heart
  get heart() {
    if (!this.dynamicHeart) {
      /* we cache heart value because on disconnectCallback(when this.parentElement doesn;t esists anymore)
      we need heart to remove listeners. Also it's easier to assume that HEART value never gonna change!!!
      */

      const html = this.parentElement!.tagName === 'A'
        ? `<div class="btn-content">${HEART.html}</div>`
        : `<button class="btn-content">${HEART.html}</button>`
      this.dynamicHeart = { ...HEART, html }
    }

    return this.dynamicHeart
  }
}

window.customElements.define('x-button', XButton);
