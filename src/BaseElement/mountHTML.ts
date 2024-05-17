export default function mountHTML(root: HTMLElement, html: HTMLTemplateElement | string) {
  
  const children = Array.from(root.children).reverse() // make safe copy of children
  
  if (typeof html === 'string') {
    root.innerHTML = html
  } else {
    const node = html.content.cloneNode(true)
    root.appendChild(node) // attach content of the template
  }

  const slot = root.querySelector('slot')

  if (slot && children.length > 0) {
    children.forEach(child => {
      slot.insertAdjacentElement('afterend', child)
    })
  }

  if (slot) {
    slot.remove()
  }
}
