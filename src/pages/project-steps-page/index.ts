import BaseElement from 'BaseElement'
import HEART from './index.heart'
import CSS from './styles.css'
import type { Base5Json } from 'content/types'

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
  static observedUrlParams = ['project_slug', 'step_index']
  // Page should somehow dubscribe to all dynamic params!!!!
  // Shoudl be automatically attach to the state!

  get heart() {
    return { ...HEART, html: HEART.html.replace('@code-placeholder@', code)}
  }

  onChange_step_index(stepIndex: string) {
    const projectSlug = this.state.project_slug

    const stepIndexInt = Number.parseInt(stepIndex, 10)
    this.state.next_step = `${stepIndexInt + 1}`
    this.state.prev_step = `${stepIndexInt - 1}`

    import(`content/${projectSlug}/base.json5`).then((module: Base5Json) => {
      this.state.title = module.default.title
      this.state.nav_items = module.default.nav
    })

    import(`content/${projectSlug}/steps/${stepIndex}/index.ts`).then(module => {
      const contentNode = this.querySelector('.project-steps-page__content')!
      contentNode.innerHTML = module.default.html
      this.state.code_highlight = module.default.code_highlight// maybe exists
    })
  }

  // get debug() {
  //   return 'project-nav-page'
  // }
}

window.customElements.define('project-steps-page', ProjectStepsPage);
