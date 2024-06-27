import BaseElement from 'BaseElement';
import startIcon from './icons/start-icon.inline.svg'
import triangleIcon from './icons/triangle-icon.inline.svg'
import HEART, {propsUsedInTemplate} from './index.heart'
import CSS from "./styles.css";
import getTemplate from 'utils/getTemplate';

const MAP_IMG_SRC = {
  play: getTemplate(startIcon),
/*
convert CSS backgroudn gradient to SVG https://www.kmhcreative.com/downloads/CSS2SVG.htm
 background: linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%),
            linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%),
            linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%);
*/
  triangle: getTemplate(triangleIcon),
}

BaseElement.attachCSS(CSS)

class ProjectPanel extends BaseElement {
  static observedAttributes = [...propsUsedInTemplate, 'icon']

  get heart(): Heart {
    return HEART
  }

  onChange_icon(icon: keyof typeof MAP_IMG_SRC) {
    const iconNode = MAP_IMG_SRC[icon].content.cloneNode(true)
    console.log(iconNode)
    const svgNode = this.querySelector('svg')!
    svgNode.parentNode!.replaceChild(iconNode, svgNode)
  }
}

window.customElements.define('project-panel', ProjectPanel);
