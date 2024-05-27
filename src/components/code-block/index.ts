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

  static observedAttributes = ["highlight-lines"];

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
    this.querySelector('pre')!.classList.add(this.getAttribute('code-lang')!)

    Prism.highlightAllUnder(this);

    this.overlayStartNode = document.createElement('span')
    this.overlayStartNode.classList.add('overlay', 'overlay-before')
    this.querySelector('code')!.appendChild(this.overlayStartNode)
    
    this.overlayEndNode = document.createElement('span')
    this.overlayEndNode.classList.add('overlay', 'overlay-after')
    this.querySelector('code')!.appendChild(this.overlayEndNode)


    // const copyButton = shadowRoot.querySelector('#copy-button')!; 
    // copyButton.addEventListener("click", () => {
    //     this.copyCode();                   
    // });
  }

  onChangeHighlightLines(oldVal: string, newVal: string) {
    if (!this.overlayStartNode || !this.overlayEndNode) return

    const [start, end] = newVal.split('-').map(v => parseInt(v, 10))
    this.overlayStartNode.style.bottom = `calc(100% - (${start - 1}em * 1.5))`
    this.overlayEndNode.style.top = `calc(${end}em * 1.5)`
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
