const parse = require('node-html-parser').parse

let classCounter = 0
function getClass() {
  return `some-hash-${classCounter++}`
}

function getSourceAttr(text) {
  /*
    1. let's find if we got any '{' and '}'
    2. return... function? template string?
  */
// "/projects/{project-slug}-{headline}/{text}/aa"
  if (text.includes('{') && text.includes('}')) {
    // might be issue when "}{"
    const templateString = text
      .replaceAll('{', "${el.attr('")
      .replaceAll('}', "')}")
    return `(el) => \`${templateString}\``
    // return text.slice(1, -1)
  }
  return null
}

const dynamicRegex = /\{[a-z\-]+\}/

module.exports = function loader(source) {
  const root = parse(source)
  root.removeWhitespace()

  const dynamics = []
  // contains strings, first part is class name or attribute name, then space, then attribute source

  function updateNodes(node) {
    if (node.nodeType !== 1) return // it's not HTMLElement

    const className = getClass()

    // check if any fo attributes has any dynamics
    Object.entries(node.attributes).forEach(([destAttr, value]) => {
      const sourceAttr = getSourceAttr(value)
      if (sourceAttr) {
        
        node.classList.add(className)
        dynamics.push(`{
          selector: '.${className}',
          sourceAttr: ${sourceAttr},
          destAttr: '${destAttr}'
        }`)
        node.removeAttribute(destAttr)
      }
    })

    // check if innerText has any dynamics
    if (node.childNodes.length === 1) {
      if (node.firstChild.nodeType === 3) {
        // TextNode
        const sourceAttr = getSourceAttr(node.firstChild.innerText.trim())
        if (!sourceAttr) return
  
        node.classList.add(className)
        dynamics.push(`{ selector: '.${className}', sourceAttr: ${sourceAttr} }`)
        node.removeChild(node.firstChild)
        return
      }
    }
    node.childNodes.forEach(updateNodes)
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
  return `
    export default {
      dynamics: [${dynamics.join(',')}],
      html: \`${root.toString()}\`
    };
  `
  // return source.toUpperCase()
}
