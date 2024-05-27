import BaseElement from 'BaseElement'
import HEART from './index.heart'
import CSS from './styles.css'

const code = `import getContext from "utils/gpu/getContext"
import getDevice from "utils/gpu/getDevice"
import setCanvasSizeObserver from "utils/gpu/setCanvasSizeObserver"

export default async function init() {
  const device = await getDevice()
  const {canvas, context} = getContext(device)

  setCanvasSizeObserver(canvas, device, render)

  function render() {
    const encoder = device.createCommandEncoder()
    const canvasTexture = context.getCurrentTexture()
    const renderPassDescriptor = {
      // describe which textures we want to raw to and how use them
      label: "our render to canvas renderPass",
      colorAttachments: [
        {
          view: canvasTexture.createView(),
          clearValue: [0, 0, 0, 1],
          loadOp: "clear", // before rendering clear the texture to value "clear". Other option is "load" to load existing content of the texture into GPU so we can draw over it
          storeOp: "store", // to store the result of what we draw, other option is "discard"
        } as const,
      ],
    }
    const pass = encoder.beginRenderPass(renderPassDescriptor)

    // do stuff

    pass.end()
    const commandBuffer = encoder.finish()
    device.queue.submit([commandBuffer])
  }
}

init()`

BaseElement.attachCSS(CSS)

class ProjectStepsPage extends BaseElement {
  get heart() {
    return { ...HEART, html: HEART.html.replace('@code-placeholder@', code)}
  }
}

window.customElements.define('project-steps-page', ProjectStepsPage);
