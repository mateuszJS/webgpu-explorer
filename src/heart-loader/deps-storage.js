const storage = {}

module.exports = {
  add(url, depsList) {
    storage[url] = depsList
  },
  getAll() {
    return storage
  }
}
