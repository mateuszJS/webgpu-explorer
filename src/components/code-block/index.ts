import Prism from './prism/prism'
import prismCSS from './prism/prism.css'
import ourCSS from './index.css'
import BaseElement from 'BaseElement'
import HEART, {propsUsedInTemplate} from './index.heart'

// Prism code generted from:
// https://prismjs.com/download.html#themes=prism-okaidia&languages=markup+clike+javascript+typescript+wgsl&plugins=highlight-keywords

BaseElement.attachCSS(prismCSS)
BaseElement.attachCSS(ourCSS)
let x = false
class CodeBlock extends BaseElement {
  private overlayStartNode?: HTMLElement
  private overlayEndNode?: HTMLElement

  static observedAttributes = ["highlight_lines", 'code_lang', 'code', ...propsUsedInTemplate];

  get heart() {
    return HEART
  }

  afterRender(hydration: boolean) {
    if (hydration) return

    this.overlayStartNode = this.querySelector('.overlay-before')!
    this.overlayEndNode = this.querySelector('.overlay-after')!
    this.querySelector('code')!.classList.add(this.state.code_lang)
    // we cannot do it in template because our DOM parser treats all content of "pre" as text node
    

    // Prism.highlightAllUnder(this);

    // const copyButton = shadowRoot.querySelector('#copy-button')!; 
    // copyButton.addEventListener("click", () => {
    //     this.copyCode();                   
    // });
  }

  onChangeText = () => {
    // if (x) return

    console.log(this.querySelector('code')?.innerText)
    Prism.highlightAllUnder(this);
    x = true
  }

  onChange_highlight_lines(value: string) {
    if (value === undefined) {
      this.overlayStartNode!.style.height = 'auto'
      this.overlayEndNode!.style.marginTop = 'auto'
    } else {
      const [start, end] = value.split('-').map(v => parseInt(v, 10))
      this.overlayStartNode!.style.height = `calc(${start}lh)`
      this.overlayEndNode!.style.marginTop = `calc(${end}lh)`
    }
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
