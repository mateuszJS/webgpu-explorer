const path = require("path");
const fs = require("fs"); // Load the filesystem module

const redFont = '\x1b[31m'
const greenFont = '\x1b[32m'
const resetColor = '\x1b[0m'
const inverseColor = '\x1b[7m'

function prettyBytes(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  if (i == 0) return bytes + ' ' + sizes[i];
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

function getFileId(fileName) {
  if (fileName.startsWith('main.') || fileName.startsWith('runtime.')) return fileName.match(/^([a-z]+)\./)?.[1]
  return fileName
}

function measureHTMLs() {
  const dirPath = path.resolve(__dirname, 'dist')
  const filePaths = fs.readdirSync(dirPath, {recursive: true}).filter(fileName => {
    if (fileName.endsWith('.html') && !fileName.endsWith('report.html')) return true
    if (fileName.startsWith('main.') || fileName.startsWith('runtime.')) return true
  });

  const results = {}
  filePaths.forEach(filePath => {
    const filePathAbsolute = path.resolve(__dirname, 'dist', filePath)
    const stats = fs.statSync(filePathAbsolute)
    const fileSizeInBytes = stats.size;
    const fileId = getFileId(filePath)
    results[fileId] = fileSizeInBytes
  })

  const lastResultsJson = path.resolve(__dirname, 'htmlOutputSize.json')

  const data = fs.readFileSync(lastResultsJson, 'utf8')
    // if (err){
    //   console.log(err);
    // } else {
  const lastResultsObj = JSON.parse(data); //now it an object
  const uniqueFileNames = Array.from(
    new Set(
      Object.keys(lastResultsObj).concat(Object.keys(results))
    )
  )

  console.log(`${inverseColor}%s${resetColor}`, 'Server Side Generated HTML files diff:')

  uniqueFileNames.forEach(fileName => {
    const prevSize = lastResultsObj[fileName] || 0
    const currSize = results[fileName] || 0
    const diff = prevSize - currSize
    const percentageDiff = (Math.abs(diff / prevSize) * 100).toFixed(2)
    
    let prefix = ''

    let fontColor = resetColor
    if (diff > 0) {
      fontColor = greenFont
      prefix = '-'
    } else if (diff < 0) {
      fontColor = redFont
      prefix = '+'
    }
    console.log(`${fontColor}%s${resetColor}`, fileName + ': ' + prefix + prettyBytes(Math.abs(diff)) + ' ' + prefix + percentageDiff + '%')
  })
      
  const resultsJson = JSON.stringify(results)
  fs.writeFileSync(lastResultsJson, resultsJson, 'utf8');
}
measureHTMLs()