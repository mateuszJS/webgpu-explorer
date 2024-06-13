import BaseElement from 'BaseElement'
import HEART from './index.heart'
import CSS from './styles.css'
import type { Nav, Base5Json } from 'content/types'

BaseElement.attachCSS(CSS)

class ProjectStepsPage extends BaseElement {
  private files: Record<string, string> = {}
  static observedUrlParams = ['project_slug', 'step_index', 'file']
  // Page should somehow dubscribe to all dynamic params!!!!
  // Shoudl be automatically attach to the state!

  get heart() {
    return HEART
    // return { ...HEART, html: HEART.html.replace('@code-placeholder@', code)}
  }

  onChange_file(fileName: string) {
    // console.log(fileName)
  }

  onChange_step_index(stepIndex: string) {
    const projectSlug = this.state.project_slug

    const stepIndexInt = Number.parseInt(stepIndex, 10)
    this.state.next_step = `${stepIndexInt + 1}`
    this.state.prev_step = `${stepIndexInt - 1}`

    fetch(require(`content/${projectSlug}/base.json5`))
      .then(res => res.json())
      .then((json: Nav) => {
        this.state.title = json.title
        this.state.nav_items = json.nav
        this.state.tabs = json.files
        // console.log('json.files', json.files)

        json.files.forEach(fileName => {
          fetch(require(`content/${projectSlug}/files/${fileName}.txt`))
            .then(res => res.text())
            .then(fileContent => {
              this.files[fileName] = fileContent
            })
        })
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
