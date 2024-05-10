import CSS from './styles.inline.css'

class XButton extends HTMLElement {
  constructor() {
    super()

    const shadow = this.attachShadow({mode: 'closed'});

    shadow.innerHTML = this.parentElement!.tagName === 'a'
      ? `<style>${CSS}</style><div><slot></slot></div>`
      : `<style>${CSS}</style><button><slot></slot></button>`
  }
}

window.customElements.define('x-button', XButton);
