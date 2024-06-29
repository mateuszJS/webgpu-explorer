export {}

declare global {
  interface Document {
    main: HTMLElement
  }

  interface Window {
    isSSG?: boolean
  }
}