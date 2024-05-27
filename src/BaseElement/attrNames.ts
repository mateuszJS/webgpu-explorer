export function propToAttrName(propName: string) {
  return propName.replace(/([A-Z])/g, g => '-' + g[0].toLowerCase());
}

export function attrToPropName(attrName: string) {
  return attrName.replace(/-([a-z])/g, g => g[1].toUpperCase());
}

export function attrOnChangeCallbackName(attrName: string) {
  return 'onChange' + attrToPropName(attrName).replace(/^./g, g => g[0].toUpperCase())
}