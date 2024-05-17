import BaseElement from 'BaseElement';
import startIcon from './icons/start-icon.inline.svg'
import triangleIcon from './icons/triangle-icon.inline.svg'
import HEART from './index.heart'
import CSS from "./styles.raw.scss";

import('components/x-link')

const MAP_IMG_SRC = {
  background: startIcon,
/*
convert CSS backgroudn gradient to SVG https://www.kmhcreative.com/downloads/CSS2SVG.htm
 background: linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%),
            linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%),
            linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%);
*/
  triangle: triangleIcon,
}

BaseElement.attachCSS(CSS)

class ProjectPanel extends BaseElement {
  get heart(): Heart {
    const svgString = MAP_IMG_SRC[this.attr('icon') as keyof typeof MAP_IMG_SRC]
    return {...HEART, html: HEART.html.replace('<svg></svg>', svgString)}
  }
}

window.customElements.define('project-panel', ProjectPanel);
