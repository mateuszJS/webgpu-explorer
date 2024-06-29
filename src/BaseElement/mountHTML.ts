import BaseElement from "BaseElement"

export default function mountHTML(root: BaseElement, html: HTMLTemplateElement | string) {
  const children = Array.from(root.childNodes) // make safe copy of children, it copies element, text nodes and comment
  // children has just html elements!, childNodes has all types of nodes
  
  if (typeof html === 'string') {
    root.innerHTML = html
  } else {
    // TODO: check if we are even using it
    const node = html.content.cloneNode(true)
    root.appendChild(node) // attach content of the template
  }

  // how to save the posotion of the slot to use it later?
  const slot = root.querySelector('slot')

  if (!slot) return

  root.slotParentNode = slot.parentElement!
  // Remember, we assume you can only update TEXT! You cannot update HTML Elements!
  // and update of text updates also neighbours(removes them)
  // it;s being said, updated text is hte only one child of its parent

  if (slot && children.length > 0) {
    children.forEach(child => {
      slot.parentNode!.insertBefore(child, slot)
    })
    root.onChangeText?.()
  }

  if (slot) {
    slot.remove()
  }
}
