const addSourcesToExpresion = require('./addSourcesToExpresion')

module.exports = function getStrInterpolationExpression(text, nameOfAdditionalSource) {
  const cbFnAttrsInput = []
  let stringInterpolation = '`'
  let i = 0

  while (i < text.length) {
    const char = text[i]
    const restOfText = text.slice(i)
    if (char === '{' && restOfText.includes('}')) {
      const length = restOfText.indexOf('}')

      const {callback, inputs} = addSourcesToExpresion(
        restOfText.slice(1, length), // 1 because 0 is {
        nameOfAdditionalSource
      )
      i += length + 1
      stringInterpolation += '${' + callback + '}'
      cbFnAttrsInput.push(...inputs)
    } else {
      const end = restOfText.indexOf('{')
      
      if (end !== -1) {
        stringInterpolation += restOfText.slice(0, end)
        i += end
      } else {
        stringInterpolation += restOfText
        break
      }
    }
  }
  stringInterpolation += '`'

  return {expression: stringInterpolation, inputs: cbFnAttrsInput}
}