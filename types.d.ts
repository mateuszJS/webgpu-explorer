declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.heart" {
  const content: Heart;
  declare export default content;
  declare export const propsUsedInTemplate: string[];
}

declare module "*.scss" {
  const content: string;
  export default content;
}

declare module "*.css" {
  const content: string;
  export default content;
}

declare module "*.inline.html" {
  const content: string;
  export default content;
}

// declare module "*.inline.html" {
//   const content: string;
//   export default content;
// }

interface LoopDynamic {
  usedProps: string[]
  dynamics: Dynamic[]
  listeners: Listener[]
  html: string
}

interface Dynamic {
  selector: string
  sourceAttr: (el: BaseElement, item?: any) => string // item is onlh then loop = true
  inputs: string[]
  destAttr?: string
  loop?: LoopDynamic
}

interface Listener {
  selector: string
  event: string
  callback: string
}

interface Heart {
  dynamics: Dynamic[]
  listeners: Listener[]
  html: string
}