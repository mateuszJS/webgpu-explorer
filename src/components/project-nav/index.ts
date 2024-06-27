import BaseElement from 'BaseElement';
import HEART, { propsUsedInTemplate } from './index.heart'
import CSS from './styles.css'
// import type { NavItem } from 'content/types';
// import 'components/project-nav-item';
// TODO: once we implement loop in template, we can remvoe this import
// it's gonna be handled by IMPORTS_TREE then

BaseElement.attachCSS(CSS)

export default class ProjectNav extends BaseElement {
  static observedAttributes = propsUsedInTemplate

  get heart() {
    console.log('ProjectNav', HEART, this.state)
    return HEART
  }

  // onChange_items(items?: NavItem[]) {
  //   if (!items) return

  //   const html = items.map(item => (
  //     `<project-nav-item headline="${item.title}" details="${this.state.with_details ? item.description : ""}"></project-nav-item>`
  //   )).join('')

  //   this.querySelector('ol')!.innerHTML = html
  // }
}

window.customElements.define('project-nav', ProjectNav);
