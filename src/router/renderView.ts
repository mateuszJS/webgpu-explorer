export enum PageTagName {
  ProjectSteps = 'project-steps-page',
  ProjectOverview = 'project-overview-page',
  Home = 'home-page',
}

export interface PageDetails {
  tagName: PageTagName
  params: Record<string, string> // snake_case because are connected to state/dynamics
}

export function getPageDetails(pathname: string): PageDetails {
  const [_, page, firstParam, subPage, secondParam] = pathname.split('/')

  if (page === 'projects' && firstParam) {

    if (subPage === 'steps' && secondParam) {
      // redirect if stepIndex is invalid
      return {
        tagName: PageTagName.ProjectSteps,
        params: { project_slug: firstParam, step_index: secondParam }
      }
    }

    // redirect if projectSlug cannot be resolved
    return {
      tagName: PageTagName.ProjectOverview,
      params: { project_slug: firstParam }
    }
  }

  return {
    tagName: PageTagName.Home,
    params: {}
  }
}

let isDuringTransition = false

export default function renderView(tagName: PageTagName) {
  const content = `<${tagName}></${tagName}>`

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