export default function mountHTML(root: HTMLElement, tmpl: HTMLTemplateElement) {
  const node = tmpl.content.cloneNode(true)

  const children = Array.from(root.children).reverse() // make safe copy of children

  root.appendChild(node) // attach content of the template

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
