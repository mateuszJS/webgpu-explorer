const parse = require('node-html-parser').parse

let classCounter = 0
function getClass() {
  return `h3t-${classCounter++}`
}

const reAllDynamics = /\{[-a-z]+\}/g

function getSourceAttr(text) {
  if (text.includes('{') && text.includes('}')) {
    // might be issue when "}{"
    const inputs = Array.from(
      text.matchAll(reAllDynamics)
    ).map(match => `'${match[0].slice(1, -1)}'`)

    const cbFnAttrsInput = `[${inputs.join(',')}]`

    const templateString = text
      .replaceAll('{', "${el.attr('")
      .replaceAll('}', "')}")
    const callbackFn = `(el) => \`${templateString}\``

    return [callbackFn, cbFnAttrsInput]
  }
  return [null, null]
}

function getListenerAttr(attr, callback) {
  if (attr[0] === '@') {
    // might be issue when "}{"
    const templateString = text
      .replaceAll('{', "${el.attr('")
      .replaceAll('}', "')}")
    return `(el) => \`${templateString}\``
  }
  return null
}

module.exports = function loader(source) {
  const root = parse(source)
  root.removeWhitespace()

  const dynamics = []
  const listeners = []

  function handleListeners(node, className, attrValue, attrName) {
    if (attrName[0] === '@') {
      listeners.push(`{
        selector: '.${className}',
        event: '${attrName.slice(1)}',
        callback: '${attrValue}'
      }`)
      node.classList.add(className)
      node.removeAttribute(attrName)
    }
  }

  /**
   * If dynamic exists in value, then adds it to dynamics list and removes from the node
   * @param {*} node 
   * @param {*} className 
   * @param {*} value 
   * @param {*} destAttr 
   */
  function handleDynamic(node, className, attrValue, attrName) {
    const [callbackFn, cbFnAttrsInput] = getSourceAttr(attrValue)
    if (!callbackFn) return

    node.classList.add(className)
    dynamics.push(`{
      selector: '.${className}',
      sourceAttr: ${callbackFn},
      inputs: ${cbFnAttrsInput}
      ${attrName ? `,destAttr: '${attrName}'` : ''}
    }`)

    if (attrName) {
      node.removeAttribute(attrName)
    } else {
      node.removeChild(node.firstChild)
    }
  }

  function updateNodes(node) {
    if (node.nodeType !== 1) return // it's not HTMLElement

    const className = getClass()

    // check if any fo attributes has any dynamics
    Object.entries(node.attributes).forEach(([attrName, attrValue]) => {
      handleDynamic(node, className, attrValue, attrName)
      handleListeners(node, className, attrValue, attrName)
    })

    // check if innerText has any dynamics
    if (node.childNodes.length === 1 && node.firstChild.nodeType === 3) {
      // TextNode
      handleDynamic(node, className, node.firstChild.innerText.trim())
    }

    node.childNodes.forEach(updateNodes)
  }

  updateNodes(root)

  return `export default {
  dynamics: [${dynamics.join(',')}],
  listeners: [${listeners.join(',')}],
  html: \`${root.toString()}\`
};`
}
