export enum Page {
  ProjectSteps = 'project-steps-page',
  ProjectOverview = 'project-overview-page',
  Home = 'home-page',
}

export function getPage(pathname: string): Page {
  const [_, page, firstParam, subPage, secondParam] = pathname.split('/')

  if (page === 'projects' && firstParam) {

    if (subPage === 'steps' && secondParam) {
      // redirect if stepIndex is invalid
      return Page.ProjectSteps
    }

    // redirect if projectSlug cannot be resolved
    return Page.ProjectOverview
  }

  return Page.Home
}

export default async function updateView(page: Page) {
  switch (page) {
    case Page.ProjectSteps: return renderView('<project-steps-page></project-steps-page>')
    case Page.ProjectOverview: return renderView('<project-overview-page></project-overview-page>')
    case Page.Home: return renderView('<home-page></home-page>')
  }
}

let isDuringTransition = false

function renderView(content: string) {
  if (isDuringTransition) return
  isDuringTransition = true

  const currView = document.main.querySelector('.view')

  document.main.classList.add('in-transition')

  currView?.classList.add('old')

  const newView = document.createElement('div')
  newView.innerHTML = content
  newView.classList.add('view', 'new', 'delay')
  // transition-delay works on a class that was attached BEFORE the transition started,
  // but not in case for a new element(commtied changes) apparently
  // transition-delay on .new class doesn't work
  document.main.appendChild(newView)
  
  newView.offsetLeft // just triggerring submit changes, reflow & repaint
  
  newView.classList.remove('new')

  function removeArtifacts(event: TransitionEvent) {
    // event is called for any transition within the element
    if (event.target !== newView) return
    // TODO: check if current view is correct for the current url
    newView.classList.remove('delay')

    currView?.remove()

    document.main.classList.remove('in-transition')

    newView.removeEventListener("transitionend", removeArtifacts);
    isDuringTransition = false
  }

  newView.addEventListener("transitionend", removeArtifacts);
}