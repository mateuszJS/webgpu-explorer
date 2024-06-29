import BaseElement from 'BaseElement';
import HEART, { propsUsedInTemplate } from './index.heart'
import CSS from './styles.css'
// import type { NavItem } from 'content/types';
// import 'components/project-nav-item';
// TODO: once we implement loop in template, we can remvoe this import
// it's gonna be handled by IMPORTS_TREE then

BaseElement.attachCSS(CSS)

export default class ProjectNav extends BaseElement {
  static observedAttributes = [...propsUsedInTemplate, 'with-details']

  get heart() {
    return HEART
  }

  onChange_details(value: string) {
    console.log('details', value)
  }

  onChange_withDetails(value: string) {
    console.log('withDetails', value)
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
