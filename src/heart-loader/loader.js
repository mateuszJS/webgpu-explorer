const parse = require('node-html-parser').parse
const storage = require('./deps-storage')
const addSourcesToExpresion = require('./addSourcesToExpresion')
const getStrInterpolationExpression = require('./getStrInterpolationExpression')

let classCounter = 0
function getClass() {
  return `h3t-${classCounter++}`
}

const camelToKebabCase = (str) => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

function getSourceAttr(text, nameOfAdditionalSource) {
  const isStringInterpolation = text[0] !== '{' || text[text.length - 1] !== '}'
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
function handleListeners(node, className, attrValue, attrName) {
  if (attrName[0] === '@') {
    node.classList.add(className)
    node.removeAttribute(attrName)
    return `{
      selector: '.${className}',
      event: '${attrName.slice(1)}',
      callback: '${attrValue}'
    }`
  }
}


function handleDynamic(node, className, attrValue, attrName, additionalSourceName) {
  const [callbackFn, cbFnAttrsInput] = getSourceAttr(attrValue, additionalSourceName)
  if (!callbackFn) return {}

  node.classList.add(className)
  const dynamic = `{
    selector: '.${className}',
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

    const className = getClass()

    if (node.tagName && node.tagName.includes('-')) {
      dependencies.add(node.tagName.toLowerCase())
    }

    if (node.hasAttribute('x-for')) {
      const [itemName, listName] = node.getAttribute('x-for').split(' in ')
      node.removeAttribute('x-for')
      propsUsedInTemplate.add(`'${listName}'`)
      // We assume there is always a parent(like ul,ol)
      node.parentNode.classList.add(className)
      // TODO: go though all dynamic, listeners related just to item

      const loopDynamics = []
      const loopListeners = []
      const loopPropsUsedInTemplate = new Set()
// do soemthign with that
      updateNodes(node, loopDynamics, loopListeners, loopPropsUsedInTemplate, itemName)
      // Finish moving extracting handleDynamic function, once its done we can run
      // dynamic collector just for this item of loop

      // export const propsUsedInTemplate = [${Array.from(propsUsedInTemplate).join(',')}]
      // export default {
      //   dynamics: [${dynamics.join(',')}],
      //   listeners: [${listeners.join(',')}],
      //   html: \`${root.toString()}\`
      // };`

      const loopUsedProps = Array.from(loopPropsUsedInTemplate)

      // we need those "state" props to refresh list when they change
      loopUsedProps.forEach(prop => propsUsedInTemplate.add(prop))

      // do we need sourceAttr?
      dynamics.push(`{
        selector: '.${className}',
        sourceAttr: () => null,
        inputs: ['${listName}'],
        loop: {
          usedProps: [${loopUsedProps.join(',')}],
          dynamics: [${loopDynamics.join(',')}],
          listeners: [${loopListeners.join(',')}],
          html: \`${node.toString()}\`
        }
      }`)

      node.parentNode.removeChild(node)

      /*
        0. We need to know the place where to render those items
        1. On change in "list" we need to render
        2. Each time you update single item, you need to update reference to the whole list as well!

        What happens when list updates:
          1. Store reference to last item, if has changed, do the update
          2. 
      */
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
      const { dynamic, usedProps } = handleDynamic(node, className, attrValue, attrName, additionalSourceName)
      const listener = handleListeners(node, className, attrValue, attrName)

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
      const { dynamic, usedProps } = handleDynamic(node, className, node.firstChild.textContent.trim(), undefined, additionalSourceName)
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
