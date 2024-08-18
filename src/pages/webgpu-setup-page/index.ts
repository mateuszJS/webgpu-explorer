import BaseElement from 'BaseElement'
import HEART from './index.heart'

class WebGpuSetupPage extends BaseElement {
  get heart() {
    return HEART
  }
}

window.customElements.define('webgpu-setup-page', WebGpuSetupPage);
