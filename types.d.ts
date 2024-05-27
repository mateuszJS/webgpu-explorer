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
  export default content
}

declare module "*.scss" {
  const content: string;
  export default content;
}

declare module "*.css" {
  const content: string;
  export default content;
}

interface Dynamic {
  selector: string
  sourceAttr: (el: HTMLElement) => string
  inputs: string[]
  destAttr?: string
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