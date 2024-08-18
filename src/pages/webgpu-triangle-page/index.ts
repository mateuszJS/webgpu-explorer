import BaseElement from 'BaseElement'
import HEART from './index.heart'

class WebGpuTrianglePage extends BaseElement {
  get heart() {
    return HEART
  }
}

window.customElements.define('webgpu-triangle-page', WebGpuTrianglePage);
