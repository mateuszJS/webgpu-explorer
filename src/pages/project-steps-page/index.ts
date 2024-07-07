import BaseElement from 'BaseElement'
import HEART, {propsUsedInTemplate} from './index.heart'
import CSS from './styles.css'
import type { Nav, Base5Json } from 'content/types'

BaseElement.attachCSS(CSS)

class ProjectStepsPage extends BaseElement {
  static observedUrlParams = ['projectSlug', 'stepIndex']
  static observedAttributes = propsUsedInTemplate
  // Page should somehow dubscribe to all dynamic params!!!!
  // Shoudl be automatically attach to the state!

  constructor() {
    super()
    this.state.onTabsChange = (tab: string) => {
      this.state.selectedFile = tab
    }
  }

  get heart() {
    return HEART
  }

  afterRender() {
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

  onChange_stepIndex(stepIndex: string | null) {
    if (!stepIndex) throw Error("stepIndex is mandatory attribute! Cannot be falsy")
    const projectSlug = this.state.projectSlug

    const stepIndexInt = Number.parseInt(stepIndex, 10)
    this.state.nextStep = `${stepIndexInt + 1}`
    this.state.prevStep = `${stepIndexInt - 1}`

    import(`content/${projectSlug}/steps/${stepIndex}/index.ts`).then(module => {
      const contentNode = this.querySelector('.project-steps-page__content')!
      contentNode.innerHTML = module.default.html
      this.state.codeHighlight = module.default.codeHighlight || null// maybe exists
      this.state.defaultFile = module.default.file
      this.state.selectedFile = module.default.file
    })
  }

  // get debug() {
  //   return 'project-steps-page'
  // }
}

window.customElements.define('project-steps-page', ProjectStepsPage);
