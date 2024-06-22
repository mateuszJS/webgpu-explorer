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

function getSourceAttr(text, useComplexStorage) {
  if (text.includes('{') && text.includes('}')) {
    // might be issue when "}{"

    let callbackFn, cbFnAttrsInput = [];
    if (useComplexStorage) {
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
              cbFnAttrsInput.push(`'${text.slice(index).match(regexDynamic)[0]}'`)
              return 'el.state.' + char
            }
            return char
          }
        }
      }).join('')

      callbackFn = `(el) => \`${templateString}\``
    }

    return [callbackFn, cbFnAttrsInput]
  }
  return [null, null]
}

module.exports = function loader(source) {
  const resourcePath = this.resourcePath
  const root = parse(source)
  root.removeWhitespace()

  const dependencies = new Set()
  const dynamics = []
  const listeners = []
  const propsUsedInTemplate = new Set()

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
    const useComplexStorage = node.tagName.includes('-') && !!attrName && regexOnlyOneDynamic.test(attrValue)
    // if it's custom element but innerText, then stringify. And also if there is no string interpolation
    const [callbackFn, cbFnAttrsInput] = getSourceAttr(attrValue, useComplexStorage)
    if (!callbackFn) return

    cbFnAttrsInput.forEach(input => {
      propsUsedInTemplate.add(input)
    })

    node.classList.add(className)
    dynamics.push(`{
      selector: '.${className}',
      sourceAttr: ${callbackFn},
      inputs: [${cbFnAttrsInput.join(',')}]
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

    if (node.tagName && node.tagName.includes('-')) {
      dependencies.add(node.tagName.toLowerCase())
    }
    
    // check if any of attributes has any dynamics
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
