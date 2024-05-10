import('pages/home')
import('pages/projectSteps')
import('pages/projectOverview')

export default function updateView(pathname: string) {
  const [_, page, firstParam, subPage, secondParam] = pathname.split('/')

  if (page === 'projects' && firstParam) {

    if (subPage === 'steps' && secondParam) {
      // redirect if stepIndex is invalid
      // renderView(projectStepPage)
      renderView('<project-steps-page></project-steps-page>')
      return
    }
    
    // redirect if projectSlug cannot be resolved
    renderView('<project-overview-page></project-overview-page>')
    return
  }

  renderView('<home-page></home-page>')
}


function renderView(content: string) {
  const mainNode = document.querySelector('main')!
  const currView = mainNode.querySelector('.view')

  mainNode.classList.add('in-transition')

  currView?.classList.add('old')

  const newView = document.createElement('div')
  newView.innerHTML = content
  newView.classList.add('view', 'new')
  
  mainNode.appendChild(newView)
  
  newView.offsetLeft // just triggerring submit changes, reflow & repaint
  
  newView.classList.remove('new')

  newView.addEventListener("transitionend", (event) => {
    // event is called for any transition within the element
    if (event.target === newView) {
      currView?.remove()
      mainNode.classList.remove('in-transition')
    }
  });
}