import Prism from './prism/prism'
import ourCSS from './index.css'
import prismCSS from './prism/prism.css'
import BaseElement from 'BaseElement'
import HEART from './index.heart'

// Prism code generted from:
// https://prismjs.com/download.html#themes=prism-okaidia&languages=markup+clike+javascript+typescript+wgsl&plugins=highlight-keywords

BaseElement.attachCSS(prismCSS)
BaseElement.attachCSS(ourCSS)

class CodeBlock extends BaseElement {
  private overlayStartNode?: HTMLElement
  private overlayEndNode?: HTMLElement

  static observedAttributes = ["highlight_lines", 'code_lang'];

  get heart() {
    return HEART
    // return {
    //   dynamics: [],
    //   listeners: [],
    //   html: `<pre id="pre"><code id="code">${this.innerHTML.trim()}</code></pre>`
    // }
  }

  afterRender(hydration: boolean) {
    if (hydration) return

    this.overlayStartNode = this.querySelector('.overlay-before')!
    this.overlayEndNode = this.querySelector('.overlay-after')!
    this.querySelector('pre')!.classList.add(this.state.code_lang)

    Prism.highlightAllUnder(this);

    // const copyButton = shadowRoot.querySelector('#copy-button')!; 
    // copyButton.addEventListener("click", () => {
    //     this.copyCode();                   
    // });
  }

  onChange_highlight_lines(value: string) {
    if (value === undefined) return

    const [start, end] = value.split('-').map(v => parseInt(v, 10))
    this.overlayStartNode!.style.height = `calc(${start}lh)`
    this.overlayEndNode!.style.marginTop = `calc(${end}lh)`
  }
  
  // copyCode() {
  //   const { shadowRoot } = this;
  //   const codeNode = shadowRoot!.querySelector('#code');  
  //   const range = document.createRange();  
  //   range.selectNode(codeNode!);  
  //   window.getSelection()!.addRange(range); 
  //   try {  
  //     document.execCommand('copy');  
  //   } catch(err) {  
  //     console.warn('Oops, unable to copy');  
  //   } 
  // }


}

customElements.define('code-block', CodeBlock);
