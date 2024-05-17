const parse = require('node-html-parser').parse

let classCounter = 0

function getSourceAttr(text) {
  if (text[0] === '{' && text[text.length - 1] === '}') {
    return text.slice(1, -1)
  }
  return ''
}

const dynamicRegex = /\{[a-z\-]+\}/

module.exports = function(source) {
  const root = parse(source)

  const dynamics = []
  // contains strings, first part is class name or attribute name, then space, then attribute source

  function updateNodes(node) {
    if (node.nodeType === 3) {
      // TextNode
      const sourceAttr = getSourceAttr(node.innerText.trim())
      if (!sourceAttr) return

      const parent = node.parentNode
      const className = `some-hash-${classCounter++}`
      parent.classList.add(className)
      dynamics.push(`.${className}|${sourceAttr}`)
      parent.removeChild(node)
    } else if (node.nodeType === 1) {
      /*
      TODO:
      1. one class for name and attribute, so we just need to check both at once
      2. value might consist of interpolation, where might be used more than one attribute
      // sourceattr can be "prefix1{attrA}middle_part{attrB}suffic{attrC}xxx"
      // if you noticed at leats one valid dynamic, then:
      // into "prefix1{attrA},middle_part{attrB}suffic{attrC}xxx"
      // and split them by {} in BaseElement?
      */
      // HTMLElement
      Object.entries(node.attributes).forEach(([destAttr, value]) => {
        const sourceAttr = getSourceAttr(value)
        if (sourceAttr) {
          const className = `some-hash-${classCounter++}`
          node.classList.add(className)
          dynamics.push(`.${className}|${sourceAttr}|${destAttr}`)
          node.removeAttribute(destAttr)
        }
      })
      node.childNodes.forEach(updateNodes)
    }
  }

  updateNodes(root)
  /*
    .class-name|destination-attribute(optional)|source-attribute,
    .class-name|destination-attribute(optional)|source-attribute
    @@@
    <h1>
      <span>
        ....
  */
  return `${dynamics.join(',')}@@@${root.toString()}`
  // return source.toUpperCase()
}