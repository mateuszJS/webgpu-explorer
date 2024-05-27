import importPage from "./importsMap"
import updateView, { getPage } from "./updateView"

export default function initRouter() {
  // handles back and forward history buttons in browser
  window.onpopstate = () => {
    updateView(getPage(window.location.pathname))
  }

  document.main = document.querySelector('main')!

  const page = getPage(window.location.pathname)
  importPage(page) 

  if (document.main.children.length === 0) {
    // so during development and server side generating we gonna updateView, but not when serving static HTML(bcuz alreayd got children in main)
    updateView(page)
  }
}
