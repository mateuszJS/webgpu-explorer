import BaseElement from 'BaseElement';
import HEART from './index.heart'
import CSS from './styles.css'
import type { NavItem } from 'content/types';

BaseElement.attachCSS(CSS)

import('components/project-nav-item')

export default class ProjectNav extends BaseElement {
  static observedAttributes = ['items', 'with_details']

  get heart() {
    return HEART
  }

  onChange_items(items?: NavItem[]) {
    if (!items) return

    const html = items.map(item => (
      `<project-nav-item headline="${item.title}" details="${this.state.with_details ? item.description : ""}"></project-nav-item>`
    )).join('')
    console.log(html)
    this.querySelector('ol')!.innerHTML = html
  }
}

window.customElements.define('project-nav', ProjectNav);
