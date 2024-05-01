import homePage from 'pages/home/index.inline.html'
import projectPage from 'pages/project/index.inline.html'

export default function updateView(pathname: string) {
  const [_, page, projectSlug] = pathname.split('/')

  if (page === 'projects' && projectSlug) {
    renderView(projectPage)
    return
  }

  renderView(homePage)
}


function renderView(content: string) {
  const mainNode = document.querySelector('main')!
  const currView = document.querySelector('.view')

  mainNode.classList.add('in-transition')

  currView?.classList.add('old')

  const newView = document.createElement('div')
  newView.innerHTML = content
  newView.classList.add('view', 'new')
  
  mainNode.appendChild(newView)
  
  newView.offsetLeft // just triggerring submit changes, reflow & repaint
  
  newView.classList.remove('new')

  newView.addEventListener("transitionend", () => {
    currView?.remove()
    mainNode.classList.remove('in-transition')
});
}