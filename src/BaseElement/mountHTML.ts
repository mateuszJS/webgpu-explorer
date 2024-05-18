export default function mountHTML(root: HTMLElement, html: HTMLTemplateElement | string) {
  const children = Array.from(root.childNodes) // make safe copy of children, it copies element, text nodes and comment
  // children has just elements!
  
  if (typeof html === 'string') {
    root.innerHTML = html
  } else {
    const node = html.content.cloneNode(true)
    root.appendChild(node) // attach content of the template
  }

  const slot = root.querySelector('slot')

  if (slot && children.length > 0) {
    children.forEach(child => {
      slot.parentNode!.insertBefore(child, slot)
    })
  }

  if (slot) {
    slot.remove()
  }
}
