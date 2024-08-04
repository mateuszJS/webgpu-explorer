import BaseElement from 'BaseElement';
import HEART, {propsUsedInTemplate} from './index.heart'
import CSS from "./styles.css";


BaseElement.attachCSS(CSS)

class ImportSvg extends BaseElement {
  static observedAttributes = ['path', propsUsedInTemplate]

  get heart(): Heart {
    return HEART
  }

  onChange_path(newPath: string) {
    if (window.isSSG) return

    // fetch(newPath)
    //   .then(res => res.text())
    //   .then(svgStr => {
    //     this.innerHTML = svgStr
    //   })
  }
}

window.customElements.define('import-svg', ImportSvg);
