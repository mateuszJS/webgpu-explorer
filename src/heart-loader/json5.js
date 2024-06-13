const JSON5 = require('json5')

module.exports = function loader(source) {
  return JSON.stringify(JSON5.parse(source))
}