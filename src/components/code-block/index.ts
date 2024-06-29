import Prism from './prism/prism'
import prismCSS from './prism/prism.css'
import ourCSS from './index.css'
import BaseElement from 'BaseElement'
import HEART, {propsUsedInTemplate} from './index.heart'

// Prism code generted from:
// https://prismjs.com/download.html#themes=prism-okaidia&languages=markup+clike+javascript+typescript+wgsl&plugins=highlight-keywords

BaseElement.attachCSS(prismCSS)
BaseElement.attachCSS(ourCSS)

class CodeBlock extends BaseElement {
  // We cannot use codeLang because content of PRE is treated as text node,
  // so no way to assign attribute to <code> which is inside <pre>
  static observedAttributes = ["highlight-lines", 'code-lang', ...propsUsedInTemplate];

  get heart() {
    return HEART
  }

  onChangeText = () => {
    this.querySelector('code')!.classList.add(this.state.codeLang)
    Prism.highlightAllUnder(this);
  }

  onChange_highlightLines(value: string | null) {
    const [start, end] = value ? value.split('-') : [null, null]
    this.style.setProperty('--first-line', start);
    this.style.setProperty('--last-line', end);
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
