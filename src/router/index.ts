import importPage from "./importsMap"
import renderView, { PageDetails, getPageDetails } from "./renderView"

type PageDetailsCallback = (pageDetails: PageDetails) => void

let listeners: PageDetailsCallback[] = []

function getCurrUrl() {
  return window.location.pathname + window.location.search
}

export function subscribeUrl(callback: PageDetailsCallback): VoidFunction {
  listeners.push(callback)
  callback(getPageDetails(getCurrUrl()))
  return () => {
    listeners = listeners.filter(cb => cb !== callback)
  }
}

let lastNavigationPage: PageDetails | undefined;

export async function navigate(newPage: PageDetails, bypassCheck?: boolean) {
  if (bypassCheck || lastNavigationPage?.tagName !== newPage.tagName) {
    listeners = [] // otherwise all callbacks will be called, while new URL doesn't match currently rendered page
    renderView(newPage.tagName, () => {
      if (newPage.tagName !== lastNavigationPage!.tagName) {
        navigate(lastNavigationPage!, true)
      }
    })
  }

  lastNavigationPage = newPage
  listeners.forEach(callback => callback(newPage))
}

export default function initRouter() {
  // handles back and forward history buttons in browser
  window.onpopstate = () => {
    navigate(getPageDetails(getCurrUrl()))
  }

  document.main = document.querySelector('main')!

  const currPage = getPageDetails(getCurrUrl())
  importPage(currPage.tagName)

  if (document.main.children.length === 0) {
    // so during development and server side generating we gonna renderView, but not when serving static HTML(bcuz alreayd got children in main)
    navigate(currPage)
  }
}
