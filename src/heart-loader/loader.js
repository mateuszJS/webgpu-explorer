const parse = require('node-html-parser').parse
const storage = require('./deps-storage')

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

module.exports = function loader(source) {
  // console.log('ooooooooooooooooooooo')
  // const { _compiler, _compilation, _module, fs, environment, resourcePath, ...rest } = this
  // _module got a lot of details
  // console.log(resourcePath, rest)


  // resourcePath: '/Users/mateuszwalendzik/Documents/repos/webgpu-explorer/src/components/project-panel/index.heart',
  const root = parse(source)
  root.removeWhitespace()

  const dependencies = new Set()
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

    // const isCustomElem = node.tagName.includes('-')
    // console.log('===========================')
    // const { global, ...rest } = this
    // console.log(rest)
    /*console.log('*******restParams*******')
    console.log(restParams) // []
    console.log('*******GLOBAL*******')
    console.log(this.global)
    console.log('*******_PARAM*******')
    console.log(this.__param())
    console.log('*******_PROPS_KEY*******')
    console.log(this.__propKey()) // undefined
    */
    // console.log(node.tagName)
    // console.log(this.resourcePath)
    if (node.tagName && node.tagName.includes('-')) {
      dependencies.add(node.tagName.toLowerCase())
      // maybe we need to pass soemthing from param?
      // we need current file path
      // storage.add(this.module, node.tagName)
    }
    

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

  const componentName = this.resourcePath.match(/.+\/([-a-z]+)\/index.heart$/)?.[1]
  if (!componentName) {
    throw Error(`Not a valid custom element name for path ${this.resourcePath}`)
  }
  console.log(componentName)
  storage.add(componentName, Array.from(dependencies))


  return `export default {
  dynamics: [${dynamics.join(',')}],
  listeners: [${listeners.join(',')}],
  html: \`${root.toString()}\`
};`
}
