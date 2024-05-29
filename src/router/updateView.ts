let isDuringTransition = false

// check if when we load just nest page html components(because of link) then does webpack also load subimports or not?

enum Page {
  ProjectSteps = 'project-steps',
  ProjectOverview = 'project-overview',
  Home = 'home',
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
    case 'project-steps': return renderView('<project-steps-page></project-steps-page>')
    case 'project-overview': return renderView('<project-overview-page></project-overview-page>')
    case 'home': return renderView('<home-page></home-page>')
  }
}

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

  newView.addEventListener("transitionend", (event) => {
    // event is called for any transition within the element
    if (event.target === newView) {
      // TODO: check if current view is correct for the current url
      newView.classList.remove('delay')

      currView?.remove()
      setTimeout(
        () => document.main.classList.remove('in-transition'),
        100, // TODO, fix it!!!!!
      )
      isDuringTransition = false
    }
  });
}