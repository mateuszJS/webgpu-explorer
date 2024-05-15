import Prism from './prism/prism'
import ourStyles from './index.raw.scss'
import prismStyles from './prism/prism.raw.scss'

// Prism code generted from:
// https://prismjs.com/download.html#themes=prism-okaidia&languages=markup+clike+javascript+typescript+wgsl&plugins=highlight-keywords

class CodeBlock extends HTMLElement {
  private overlayStartNode: HTMLElement
  private overlayEndNode: HTMLElement

  static observedAttributes = ["highlight-lines"];

  constructor() {
    super();
    const shadowRoot = this.attachShadow({mode: 'open'});
    const trimmed = this.innerHTML.trim();

    shadowRoot.innerHTML = `
      <style>${prismStyles}${ourStyles}</style>
      <pre id="pre"><code id="code">${trimmed}</code></pre>
    `
    this.overlayStartNode = shadowRoot.querySelector('.overlay-before')!
    this.overlayEndNode = shadowRoot.querySelector('.overlay-after')!
    shadowRoot.querySelector('pre')!.classList.add(this.getAttribute('code-lang')!)

    Prism.highlightAllUnder(shadowRoot);

    this.overlayStartNode = document.createElement('span')
    this.overlayStartNode.classList.add('overlay', 'overlay-before')
    shadowRoot.querySelector('code')!.appendChild(this.overlayStartNode)
    
    this.overlayEndNode = document.createElement('span')
    this.overlayEndNode.classList.add('overlay', 'overlay-after')
    shadowRoot.querySelector('code')!.appendChild(this.overlayEndNode)


    // const copyButton = shadowRoot.querySelector('#copy-button')!; 
    // copyButton.addEventListener("click", () => {
    //     this.copyCode();                   
    // });
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    console.log(name, oldValue, newValue)
    switch (name) {
      case 'highlight-lines': {
        const [start, end] = newValue.split('-').map(v => parseInt(v, 10))
        this.overlayStartNode.style.bottom = `calc(100% - (${start - 1}em * 1.5))`
        this.overlayEndNode.style.top = `calc(${end}em * 1.5)`
        break;
      }
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
