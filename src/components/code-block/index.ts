import Prism from './prism/prism'
import ourStyles from './index.inline.css'
import prismStyles from './prism/prism.inline.css'

// Prism code generted from:
// https://prismjs.com/download.html#themes=prism-okaidia&languages=markup+clike+javascript+typescript+wgsl&plugins=highlight-keywords

class CodeBlock extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({mode: 'open'});
    const trimmed = this.innerHTML.trim();
    
    let lineNumbersClass = "";
    if (this.classList.contains("line-numbers")) {
      lineNumbersClass = "line-numbers";
    }

    shadowRoot.innerHTML = `
      <style>${prismStyles}${ourStyles}</style>
      <pre class="${lineNumbersClass} ${this.classList}" id="pre"><code id="code">${trimmed}</code><button id="copy-button">Copy</button></pre>
    `

    Prism.highlightAllUnder(shadowRoot);

    const copyButton = shadowRoot.querySelector('#copy-button')!; 
    copyButton.addEventListener("click", () => {
        this.copyCode();                   
    });
  }
  
  copyCode() {
    const { shadowRoot } = this;
    const codeNode = shadowRoot!.querySelector('#code');  
    const range = document.createRange();  
    range.selectNode(codeNode!);  
    window.getSelection()!.addRange(range); 
    try {  
      document.execCommand('copy');  
    } catch(err) {  
      console.warn('Oops, unable to copy');  
    } 
  }
}

customElements.define('code-block', CodeBlock);
