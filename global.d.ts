export {}

declare global {
  interface Window {
    main: HTMLElement
  }
  interface Document {
    main: HTMLElement
  }
}