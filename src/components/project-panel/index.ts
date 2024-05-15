import startIcon from './icons/start-icon.inline.svg'
import triangleIcon from './icons/triangle-icon.inline.svg'
import html from './index.inline.html'
// import CSS from "./styles.inline.css";
// import cssSrc from "./styles.link.css";
import CSS from "./styles.raw.scss";


/*
you cna override webapck loader
import froala_style from '!css-loader!../../../css/froala.css'
Prepending the ! overrides existing loaders allowing us to specify our own. In this example one can call froala_style.toString() to receive the contents of the CSS file.
*/

import('components/x-link')

// convert CSS backgroudn gradient to SVG https://www.kmhcreative.com/downloads/CSS2SVG.htm
/*
 background: linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%),
            linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%),
            linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%);
*/
const MAP_IMG_SRC = {
  background: startIcon,
  triangle: triangleIcon,
}
// USE CSS NOT INLINE!!!
// <link rel="stylesheet" href="/comicsans.css" />
// can we href to glboal styles?!

// insertAdjacentHTML

/*
<script>
  const html = `
    <div>
      <template shadowrootmode="open"></template>
    </div>
  `;
  const div = document.createElement('div');
  div.innerHTML = html; // No shadow root here
  const fragment = new DOMParser().parseFromString(html, 'text/html', {
    includeShadowRoots: true
  }); // Shadow root here
</script>
*/
console.log(CSS)

const style = document.createElement("style")
style.textContent = CSS
document.head.appendChild(style)

// or use this one!!!!
// https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/CSSStyleSheet
class ProjectPanel extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    const svgString = MAP_IMG_SRC[this.getAttribute('icon') as keyof typeof MAP_IMG_SRC]
    this.innerHTML = `<x-link>${svgString}${html}</x-link>`
    // shadow.innerHTML = `<style>${CSS}</style><x-link>${svgString}${html}</x-link>`

    this.querySelector('h3')!.innerText = this.getAttribute('headline') as string
    this.querySelector('p')!.innerText = this.getAttribute('text') as string
    this.querySelector('x-link')!.setAttribute(
      'to',
      `/projects/${this.getAttribute('project-slug')}`
    )
  }
}

window.customElements.define('project-panel', ProjectPanel);
