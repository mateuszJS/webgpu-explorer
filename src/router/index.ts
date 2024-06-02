import importPage from "./importsMap"
import updateView, { Page, getPage } from "./updateView"

let lastPage: Page | undefined;

export function updatePathname(pathname: string) {
  const newPage = getPage(pathname)

  if (lastPage !== newPage) {
    updateView(newPage)
    lastPage = newPage
  }
}

export default function initRouter() {
  // handles back and forward history buttons in browser
  window.onpopstate = () => {
    updatePathname(window.location.pathname)
  }

  document.main = document.querySelector('main')!

  lastPage = getPage(window.location.pathname)
  importPage(lastPage)

  if (document.main.children.length === 0) {
    // so during development and server side generating we gonna updateView, but not when serving static HTML(bcuz alreayd got children in main)
    updateView(lastPage)
  }
}
