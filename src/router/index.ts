import importPage from "./importsMap"
import renderView, { PageDetails, PageTagName, getPageDetails } from "./renderView"

let lastPage: PageTagName | undefined;

type PageDetailsCallback = (pageDetails: PageDetails) => void

let listeners: PageDetailsCallback[] = []

export function subscribeUrlParams(callback: PageDetailsCallback): VoidFunction {
  listeners.push(callback)
  callback(getPageDetails(window.location.pathname))
  return () => {
    listeners = listeners.filter(cb => cb !== callback)
  }
}

export function updatePathname(pathname: string) {
  const newPage = getPageDetails(pathname)

  if (lastPage !== newPage.tagName) {
    listeners = [] // otherwise all callbacks will be called, while new URL doesn't match currently rendered page
    renderView(newPage.tagName)
    lastPage = newPage.tagName
  }

  listeners.forEach(callback => callback(newPage))
  // TODO: notify about the change
}

export default function initRouter() {
  // handles back and forward history buttons in browser
  window.onpopstate = () => {
    updatePathname(window.location.pathname)
  }

  document.main = document.querySelector('main')!

  lastPage = getPageDetails(window.location.pathname).tagName
  importPage(lastPage)

  if (document.main.children.length === 0) {
    // so during development and server side generating we gonna renderView, but not when serving static HTML(bcuz alreayd got children in main)
    renderView(lastPage)
  }
}
