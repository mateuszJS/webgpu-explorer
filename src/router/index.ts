import importPage from './importsMap'
import renderView, { PageDetails, getPageDetails } from './renderView'
import {
  initScrollRestoration,
  restoreScrollPosition,
  saveScrollPosition,
} from './scrollRestoration'

type PageDetailsCallback = (pageDetails: PageDetails) => void

let listeners: PageDetailsCallback[] = []

function getCurrUrl() {
  return window.location.pathname + window.location.search
}

export function subscribeUrl(callback: PageDetailsCallback): VoidFunction {
  listeners.push(callback)
  callback(getPageDetails(getCurrUrl()))
  return () => {
    listeners = listeners.filter((cb) => cb !== callback)
  }
}

export function navigateUrl(to: string) {
  saveScrollPosition()
  window.history.pushState({}, '', window.location.origin + to)
  updateViewHTML(getPageDetails(to))
}

let lastNavigationPage: PageDetails | undefined

/**
 * Updates html code accordingly to current url.
 * @param newPage
 * @param bypassCheck
 */
export async function updateViewHTML(newPage: PageDetails, bypassCheck?: boolean) {
  if (bypassCheck || lastNavigationPage?.tagName !== newPage.tagName) {
    listeners = [] // otherwise all callbacks will be called, while new URL doesn't match currently rendered page
    renderView(newPage.tagName, () => {
      if (newPage.tagName !== lastNavigationPage!.tagName) {
        updateViewHTML(lastNavigationPage!, true)
        return
      }

      restoreScrollPosition()
      // Restore only after the view transition finishes.
    })
  }

  lastNavigationPage = newPage
  listeners.forEach((callback) => callback(newPage))
}

export default function initRouter() {
  // handles back and forward history buttons in browser
  window.onpopstate = () => {
    updateViewHTML(getPageDetails(getCurrUrl()))
  }

  document.main = document.querySelector('main')!

  const currPage = getPageDetails(getCurrUrl())
  importPage(currPage.tagName)

  if (document.main.children.length === 0) {
    // so during development and server side generating we gonna updateViewHTML, but not when serving static HTML(because already got children in main)
    updateViewHTML(currPage)
  } else {
    // Static HTML already rendered; restore immediately.
    // restoreScrollPosition()
  }

  initScrollRestoration()
}
