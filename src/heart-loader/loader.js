const parse = require('node-html-parser').parse
const storage = require('./deps-storage')
const addSourcesToExpresion = require('./addSourcesToExpresion')
const getStrInterpolationExpression = require('./getStrInterpolationExpression')
const path = require("path");

let selectorCounter = 0
const getSelector = () => {
  return `h3t-${selectorCounter++}`
}

const camelToKebabCase = (str) => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

const getSourceAttr = (text, nameOfAdditionalSource) => {
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
const handleListeners = (node, selector, attrValue, attrName) => {
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


const handleDynamic = (node, selector, attrValue, attrName, additionalSourceName) => {
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

module.exports = function loader(source, map, meta) {
  // https://webpack.js.org/api/loaders/#synchronous-loaders
  
  // console.log(this.context, this.fs)

  const root = parse(source)
  root.removeWhitespace()

  const dependencies = new Set()

  const updateNodes = (node, dynamics, listeners, propsUsedInTemplate, additionalSourceName) => {
    if (node.nodeType !== 1) return // it's not HTMLElement
    if (node.tagName === 'STYLE') return // inside this tag we use {}
    if (node.tagName === 'SVG') return // we don't want to mess up with SVG nodes

    if (node.tagName === 'IMPORT-SVG') {
      const pathToSVG = node.getAttribute('path')

      if (!pathToSVG) throw Error(`No path on <import-svg> in ${this.resourcePath}.`)

      const absolutePathToSvg = this.context + pathToSVG
      let svgContent
      try {
        svgContent = this.fs.readFileSync(absolutePathToSvg, 'utf8')
      } catch(err) {
        console.error(err)
        this.addMissingDependency(absolutePathToSvg)
      }
      
      if (svgContent) {
        this.addDependency(absolutePathToSvg)

        if (node.hasAttribute('inline')) {
          const svgElement = parse(svgContent)
          node.replaceWith(svgElement)
          return
        }

        const mainHash = this.utils.createHash(
          this._compilation.outputOptions.hashFunction
        );
        mainHash.update(svgContent);
        const hashStr = mainHash.digest('hex');
        const hashedName = `${hashStr}.svg`

        this.emitFile(hashedName, svgContent)

        node.setAttribute('path', '/' + hashedName)
      }

      // return
      /*
        const mainHash = this.utils.createHash(
          this._compilation.outputOptions.hashFunction
        );
        mainHash.update(content);
        mainHash.digest('hex');
      */


      // this.fs.
      // this.fs

      /*
        this.addDependency(file: string)
        so whenever dependency changes, this laoder also changes

        addMissingDependency(file: string)
        watched files that are nto created yet also
      */
    }

    if (node.tagName === 'IMPORT-CODE') {
      const pathToCode = node.getAttribute('path')

      if (!pathToCode) throw Error(`No path on <import-code> in ${this.resourcePath}.`)

      const absolutePathToCode = this.context + pathToCode
      let codeContent
      try {
        codeContent = this.fs.readFileSync(absolutePathToCode, 'utf8')
      } catch(err) {
        console.error(err)
        this.addMissingDependency(absolutePathToCode)
      }
      
      if (codeContent) {
        this.addDependency(absolutePathToCode)

        node.replaceWith(codeContent)
      }
        return
    }


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
      // statis attributes need to be kebab case as well!
      // expect svg attributes, those has allowed camel case attributes
      node.removeAttribute(attrName)
      node.setAttribute(camelToKebabCase(attrName), attrValue)
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

  const componentName = this.resourcePath.match(/.+\/([-a-z]+)\/index.heart$/)?.[1]
  if (!componentName) {
    throw Error(`Not a valid custom element name for path ${this.resourcePath}`)
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
