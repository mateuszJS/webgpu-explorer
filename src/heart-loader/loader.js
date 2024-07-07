const parse = require('node-html-parser').parse
const storage = require('./deps-storage')
const addSourcesToExpresion = require('./addSourcesToExpresion')
const getStrInterpolationExpression = require('./getStrInterpolationExpression')

let selectorCounter = 0
function getSelector() {
  return `h3t-${selectorCounter++}`
}

const camelToKebabCase = (str) => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

function getSourceAttr(text, nameOfAdditionalSource) {
  const isStringInterpolation = text[0] !== '{' || text.at(-1) !== '}'
  // const isStringInterpolation = text[0] !== '{' || text[text.length - 1] !== '}'
  // if whole attribute value is wrapper with brackets, then it's not a string interpolation

  if (text.includes('{') && text.includes('}')) {
    // might be issue when "}{"

    let callbackFn, cbFnAttrsInput = [];

    if (isStringInterpolation) {
      const {expression, inputs} = getStrInterpolationExpression(text, nameOfAdditionalSource)
      cbFnAttrsInput = inputs
      callbackFn = expression
    } else {
      const {callback, inputs} = addSourcesToExpresion(text.slice(1, -1), nameOfAdditionalSource)
      cbFnAttrsInput = inputs
      callbackFn = callback
    }

    wrapperCallbackFn = `(el${nameOfAdditionalSource ? `,${nameOfAdditionalSource}` : ''}) => ${callbackFn}`

    return [wrapperCallbackFn, cbFnAttrsInput]
  }
  return [null, null]
}

// returns stirng or undefined, depending if there is a listener or not
function handleListeners(node, selector, attrValue, attrName) {
  if (attrName[0] === '@') {
    node.setAttribute(selector, '')
    node.removeAttribute(attrName)
    return `{
      selector: '[${selector}]',
      event: '${attrName.slice(1)}',
      callback: '${attrValue}'
    }`
  }
}


function handleDynamic(node, selector, attrValue, attrName, additionalSourceName) {
  const [callbackFn, cbFnAttrsInput] = getSourceAttr(attrValue, additionalSourceName)
  if (!callbackFn) return {}

  node.setAttribute(selector, '')
  const dynamic = `{
    selector: '[${selector}]',
    sourceAttr: ${callbackFn},
    inputs: [${cbFnAttrsInput.join(',')}]
    ${attrName ? `,destAttr: '${attrName}'` : ''}
  }`

  if (attrName) {
    node.removeAttribute(attrName)
  } else {
    node.removeChild(node.firstChild)
  }

  return { dynamic, usedProps: cbFnAttrsInput }
}

module.exports = function loader(source) {
  const resourcePath = this.resourcePath
  const root = parse(source)
  root.removeWhitespace()

  const dependencies = new Set()

  function updateNodes(node, dynamics, listeners, propsUsedInTemplate, additionalSourceName) {
    if (node.nodeType !== 1) return // it's not HTMLElement

    const selector = getSelector()

    if (node.tagName && node.tagName.includes('-')) {
      dependencies.add(node.tagName.toLowerCase())
    }

    if (node.hasAttribute('x-for')) {
      const [itemName, listName] = node.getAttribute('x-for').split(' in ')
      node.removeAttribute('x-for')
      propsUsedInTemplate.add(`'${listName}'`)
      // We assume there is always a parent(like ul,ol)
      node.parentNode.setAttribute(selector ,'')
      // TODO: go though all dynamic, listeners related just to item

      const loopDynamics = []
      const loopListeners = []
      const loopPropsUsedInTemplate = new Set()

      updateNodes(node, loopDynamics, loopListeners, loopPropsUsedInTemplate, itemName)
      // Finish moving extracting handleDynamic function, once its done we can run
      // dynamic collector just for this item of loop

      const loopUsedProps = Array.from(loopPropsUsedInTemplate)

      // we need those "state" props to refresh list when they change
      loopUsedProps.forEach(prop => propsUsedInTemplate.add(prop))

      // do we need sourceAttr?
      dynamics.push(`{
        selector: '[${selector}]',
        sourceAttr: () => null,
        inputs: ['${listName}',${loopUsedProps.join(',')}],
        loop: {
          dynamics: [${loopDynamics.join(',')}],
          listeners: [${loopListeners.join(',')}],
          html: \`${node.toString()}\`
        }
      }`)

      node.parentNode.removeChild(node)

      return
    }

    Object.entries(node.attributes).forEach(([attrName, attrValue]) => {
      if (node.tagName !== 'SVG') {
        // statis attributes need to be kebab case as well!
        // expect svg attributes, those has allowed camel case attributes
        node.removeAttribute(attrName)
        node.setAttribute(camelToKebabCase(attrName), attrValue)
      }
    })
    
    // check if any of attributes has any dynamics
    Object.entries(node.attributes).forEach(([attrName, attrValue]) => {
      const { dynamic, usedProps } = handleDynamic(node, selector, attrValue, attrName, additionalSourceName)
      const listener = handleListeners(node, selector, attrValue, attrName)

      if (dynamic) {
        usedProps.forEach(input => propsUsedInTemplate.add(input))
        dynamics.push(dynamic)
      }

      if (listener) {
        listeners.push(listener)
      }
    })

    // check if textContent has any dynamics
    if (node.childNodes.length === 1 && node.firstChild.nodeType === 3) {
      // TextNode
      const { dynamic, usedProps } = handleDynamic(node, selector, node.firstChild.textContent.trim(), undefined, additionalSourceName)
      if (dynamic) {
        usedProps.forEach(input => propsUsedInTemplate.add(input))
        dynamics.push(dynamic)
      }
    }

    node.childNodes.forEach(node => updateNodes(node, dynamics, listeners, propsUsedInTemplate, additionalSourceName))
  }

  const dynamics = []
  const listeners = []
  const propsUsedInTemplate = new Set()

  updateNodes(root, dynamics, listeners, propsUsedInTemplate, undefined)

  const componentName = resourcePath.match(/.+\/([-a-z]+)\/index.heart$/)?.[1]
  if (!componentName) {
    throw Error(`Not a valid custom element name for path ${resourcePath}`)
  }

  storage.add(componentName, Array.from(dependencies))

  return `
  export const propsUsedInTemplate = [${Array.from(propsUsedInTemplate).join(',')}]
  export default {
    dynamics: [${dynamics.join(',')}],
    listeners: [${listeners.join(',')}],
    html: \`${root.toString()}\`
  };`
}
