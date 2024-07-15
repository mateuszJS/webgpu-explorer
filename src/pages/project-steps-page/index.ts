import BaseElement from 'BaseElement'
import HEART, {propsUsedInTemplate} from './index.heart'
import CSS from './styles.css'
import type { Nav, Base5Json } from 'content/types'

BaseElement.attachCSS(CSS)

const files = {
  getDevice:
  `export default async function getDevice() {
  if (!navigator.gpu) {
    throw Error("this browser does not support WebGPU");
  }

  const adapter = await navigator.gpu.requestAdapter();

  if (!adapter) {
    throw Error("this browser supports webgpu but it appears disabled");
  }

  const device = await adapter.requestDevice();

  device.lost.then((info) => {
    console.error(\`WebGPU device was lost: \${info.message}\`);

    if (info.reason !== "destroyed") {
      // reprot issue to the tracking system/display error
    }
  });

  return device
}`,
getContext:
`export default function getContext(device: GPUDevice) {
  const canvas = document.querySelector<HTMLCanvasElement>("canvas")
  if (!canvas) throw Error("Canvas has to be always provided")

  const context = canvas.getContext("webgpu")
  if (!context) throw Error("WebGPU from canvas needs to be always provided")

  const presentationFormat = navigator.gpu.getPreferredCanvasFormat()
  context.configure({
    device,
    format: presentationFormat,
  })

  return {canvas, context}
}`,
indexSimplified:
`export default async function init() {
  const device = await getDevice()
  const {canvas, context} = getContext(device)
  
  function render() {
    // here we are going to continue the setup
  }

  render()
}

init()`,
index:
`export default async function init() {
  const device = await getDevice()
  const {canvas, context} = getContext(device)
  
  function render() {
    const encoder = device.createCommandEncoder()
    const canvasTexture = context.getCurrentTexture()
    const renderPassDescriptor = {
      // describe which textures we want to raw to and how use them
      label: "our render to canvas renderPass",
      colorAttachments: [
        {
          view: canvasTexture.createView(),
          clearValue: [0.2, 0, 0, 1],
          loadOp: "clear", // before rendering clear the texture to value "clear". Other option is "load" to load existing content of the texture into GPU so we can draw over it
          storeOp: "store", // to store the result of what we draw, other option is "discard"
        } as const,
      ],
    }
    const pass = encoder.beginRenderPass(renderPassDescriptor)
    // do cool stuff
    pass.end()
    const commandBuffer = encoder.finish()
    device.queue.submit([commandBuffer])
  }

  setCanvasSizeObserver(canvas, device, render)
}`
}

class ProjectStepsPage extends BaseElement {
  static observedUrlParams = ['projectSlug']
  static observedAttributes = propsUsedInTemplate
  // Page should somehow dubscribe to all dynamic params!!!!
  // Shoudl be automatically attach to the state!

  constructor() {
    super({ files })

    const projectSlug = this.state.projectSlug

    fetch(require(`content/${projectSlug}/base.json5`))
      .then(res => res.json())
      .then((json: Nav) => {
        this.state.title = json.title
        this.state.navItems = json.nav
        this.state.tabs = json.files.toReversed() // we use reverse flex direction
        this.state.selectedFile ??= this.state.tabs[0]

        json.files.forEach(fileName => {
          fetch(require(`content/${projectSlug}/files/${fileName}.txt`))
            .then(res => res.text())
            .then(fileContent => {
              this.state.files = {
                ...this.state.files,
                [fileName]: fileContent,
              }
            })
        })
      })
  }

  get heart() {
    return HEART
  }

  // get debug() {
  //   return 'project-steps-page'
  // }
}

window.customElements.define('project-steps-page', ProjectStepsPage);
