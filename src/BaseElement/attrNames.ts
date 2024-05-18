// curnelty not used

export function propToAttrName(propName: string) {
  return propName.replace(/([A-Z])/g, function (g) { return '-' + g[0].toLowerCase(); });
}

export function attrToPropName(attrName: string) {
  return attrName.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}