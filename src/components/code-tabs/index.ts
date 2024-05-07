class CodeTabs extends HTMLElement {
  constructor() {
    super();
    // const shadowRoot = this.attachShadow({mode: 'open'});
    // const trimmed = this.innerHTML.trim();
    
    // let lineNumbersClass = "";
    // if (this.classList.contains("line-numbers")) {
    //   lineNumbersClass = "line-numbers";
    // }

    // shadowRoot.innerHTML = `
    //   <style>${prismStyles}${ourStyles}</style>
    //   <pre class="${lineNumbersClass} ${this.classList}" id="pre"><code id="code">${trimmed}</code><button id="copy-button">Copy</button></pre>
    // `

    // Prism.highlightAllUnder(shadowRoot);

    // const copyButton = shadowRoot.querySelector('#copy-button')!; 
    // copyButton.addEventListener("click", () => {
    //     this.copyCode();                   
    // });
  }

}

customElements.define('code-tabs', CodeTabs);
