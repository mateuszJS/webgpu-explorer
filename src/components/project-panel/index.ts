import BaseElement from 'BaseElement'
import startIcon from './icons/start-icon.inline.svg'
import triangleIcon from './icons/triangle-icon.inline.svg'
import tooltipsIcon from './icons/tooltips-icon.inline.svg'
import cloudRaceIcon from './icons/cloud-race.inline.svg'
import HEART, { propsUsedInTemplate } from './index.heart'
import CSS from './styles.css'
import getTemplate from 'utils/getTemplate'

const MAP_IMG_SRC = {
  play: getTemplate(startIcon),
  triangle: getTemplate(triangleIcon),
  tooltips: getTemplate(tooltipsIcon),
  'cloud-race': getTemplate(cloudRaceIcon),
}

BaseElement.attachCSS(CSS)

const tags = {
  webgpu: 'WebGPU',
  'web-components': `Web
  Components`,
  'html-css': 'HTML+CSS',
  general: 'General',
  wasm: 'WebAssembly',
}

class ProjectPanel extends BaseElement {
  static observedAttributes = [...propsUsedInTemplate, 'icon']

  constructor() {
    super()
    this.classList.add('glass')
  }

  get heart(): Heart {
    return HEART
  }

  get debug() {
    return 'project-panel'
  }

  onChange_icon(icon: keyof typeof MAP_IMG_SRC | null) {
    if (!icon) throw Error('icon is mandary attribute! Cannot be falsy')
    const iconNode = MAP_IMG_SRC[icon].content.cloneNode(true)
    const svgNode = this.querySelector('svg')!
    svgNode.parentNode!.replaceChild(iconNode, svgNode)
  }

  onChange_tagId(tagId: string | null) {
    this.state.tagName = tags[tagId as keyof typeof tags]
  }
}

window.customElements.define('project-panel', ProjectPanel)
