import BaseElement from "BaseElement"

export default function mountHTML(root: BaseElement, html: HTMLTemplateElement | string) {
  const children = Array.from(root.childNodes) // make safe copy of children, it copies element, text nodes and comment
  // children has just elements!
  
  if (typeof html === 'string') {
    root.innerHTML = html
  } else {
    const node = html.content.cloneNode(true)
    root.appendChild(node) // attach content of the template
  }

  // how to save the posotion of the slot to use it later?
  const slot = root.querySelector('slot')

  if (!slot) return

  root.slotParentNode = slot.parentElement!
  // Remember, we assume you cna only update TEXT! You cannot update HTML Elements!

  if (slot && children.length > 0) {
    children.forEach(child => {
      slot.parentNode!.insertBefore(child, slot)
    })
  }

  if (slot) {
    slot.remove()
  }
}
