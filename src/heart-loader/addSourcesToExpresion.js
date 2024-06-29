const validJsName = /^[_$A-Za-z][_$A-Za-z\d]*/
// Why cannot we use upper case??
const nonInputPrefix = ['.', '\''] // probably should be more disallowed chars

// TODO: support also undefined/null

module.exports = function addSourcesToExpresion(text, nameOfAdditionalSource) {
  const keywords = ['null', 'undefined', nameOfAdditionalSource]
  const inputs = []
  let callback = ''
  let canStartInput = true
  let index = 0;

  while(index < text.length) {
    const char = text[index]

    if (!validJsName.test(char)) {
      callback += char
      canStartInput = !nonInputPrefix.includes(char) // or a big letter?
      index++
      continue
    }

    if (canStartInput) {
      canStartInput = false

      const propertyName = text.slice(index).match(validJsName)[0]
  
      if (keywords.includes(propertyName)) {
        // to handle second param for loop items
        callback += char
        index++
        continue
      }

      // We do not handle dynamic item of loop property for now

      inputs.push(`'${propertyName}'`)
      callback += 'el.state.' + propertyName
      index += propertyName.length
      continue
    }

    // it looks like input BUT input is not allowed
    callback += char
    index++
  }

  return { callback, inputs }
}