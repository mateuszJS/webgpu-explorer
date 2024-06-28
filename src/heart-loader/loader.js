const parse = require('node-html-parser').parse
const storage = require('./deps-storage')

let classCounter = 0
function getClass() {
  return `h3t-${classCounter++}`
}

const regexUppercaseLetter = /[A-Z]/
const regexDynamic = /[_a-z]+/
const regexOnlyOneDynamic= /^\{[_a-z]+\}$/
const reAllDynamics = /\{[_a-z]+\}/g

function getSourceAttr(text, useComplexStorage, additionalSourceName) {
  if (text.includes('{') && text.includes('}')) {
    // might be issue when "}{"

    let callbackFn, cbFnAttrsInput = [];
    if (useComplexStorage) {
      // IMPORTANT: currentyl we do not support compelx storage for loops
      // store will return #id of the stored item
      const withoutParantess = text.slice(1, -1)
      callbackFn = `(el) => store(el.state.${withoutParantess})`
      cbFnAttrsInput.push(`'${withoutParantess}'`)
    } else {
      let isJsAllowed = false
      const templateString = text.split('').map((char, index) => {
        switch (char) {
          case '{': {
            isJsAllowed = true
            return "${(" // additional parenties to handle || "" when closing {}
          }
          case '}': {
            isJsAllowed = false
            return ') || ""}'
          }
          default: {
            if (isJsAllowed && regexDynamic.test(char)) {
              /* it's not the first letter of variable IF
                - there is a letter before
                - there is a dot before
              */
              const prevChar = text[index - 1] // index always is at least 1, because isJsAllowed was set to true already
              if (regexDynamic.test(prevChar) || ['.', '\''].includes(prevChar)) return char // it's not a new read from state
              
              const propertyName = text.slice(index).match(regexDynamic)[0]
              cbFnAttrsInput.push(`'${propertyName}'`)

              if (propertyName === additionalSourceName) {
                // to handle second param for loop items
                return char
              }

              return 'el.state.' + char
            }
            return char
          }
        }
      }).join('')

      callbackFn = `(el${additionalSourceName ? `,${additionalSourceName}` : ''}) => \`${templateString}\``
    }

    return [callbackFn, cbFnAttrsInput]
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


function handleDynamic(node, className, attrValue, attrName, resourcePath, additionalSourceName) {
  if (node.tagName.includes('-') && regexUppercaseLetter.test(attrName)) {
    // check if its cusotm-element, because ofr example svg viewBox ususally is camelCase
    throw Error(`Usage of camelCase is not allowed for attribute names. Use sneak_case, not camelCase.
      file: ${resourcePath}
      node: ${node.tagName}
      attribute name: ${attrName}
      attribute value: ${attrValue}
    `)
  }
  if (attrValue.includes('{') && regexUppercaseLetter.test(attrValue)) {
    // we cannot use regexOnlyOneDynamic instead of includes('{') because that regex return false if we got any big letter!
    throw Error(`Usage of upper case is not allowed for dynamic values. Use sneak_case, not camelCase.
      file: ${resourcePath}
      node: ${node.tagName}
      attribute name: ${attrName}
      attribute value: ${attrValue}
    `)
  }
  const useComplexStorage =
    node.tagName.includes('-') && /* the receiver of attribute/textContent is a custom element */
    !!attrName && /* it has to be attribute, we cannot render complex data in DOM */
    regexOnlyOneDynamic.test(attrValue) /* there is only one value used in dynamic, like "{title}", not like "This is{title}."*/
  /* TODO: improve recognizing strings only */

  const [callbackFn, cbFnAttrsInput] = getSourceAttr(attrValue, useComplexStorage, additionalSourceName)
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
    
    // check if any of attributes has any dynamics
    Object.entries(node.attributes).forEach(([attrName, attrValue]) => {
      const { dynamic, usedProps } = handleDynamic(node, className, attrValue, attrName, resourcePath, additionalSourceName)
      if (dynamic) {
        usedProps.forEach(input => propsUsedInTemplate.add(input))
        dynamics.push(dynamic)
      }

      const listener = handleListeners(node, className, attrValue, attrName)
      if (listener) {
        listeners.push(listener)
      }
    })

    // check if textContent has any dynamics
    if (node.childNodes.length === 1 && node.firstChild.nodeType === 3) {
      // TextNode
      const { dynamic, usedProps } = handleDynamic(node, className, node.firstChild.textContent.trim(), undefined, resourcePath, additionalSourceName)
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
  import {store} from 'complex-storage';
  export const propsUsedInTemplate = [${Array.from(propsUsedInTemplate).join(',')}]
  export default {
    dynamics: [${dynamics.join(',')}],
    listeners: [${listeners.join(',')}],
    html: \`${root.toString()}\`
  };`
}
