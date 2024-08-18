export enum PageTagName {
  PostWebGpuTriangle = 'webgpu-triangle-page',
  PostWebGpuSetup = 'webgpu-setup-page',
  Home = 'home-page',
}

const MAP_POST_SLUG_TO_TAG = {
  'webgpu-setup': PageTagName.PostWebGpuSetup,
  'webgpu-triangle': PageTagName.PostWebGpuTriangle,
} as const

export interface PageDetails {
  tagName: PageTagName
  params?: Record<string, string> // snake_case because are connected to state/dynamics
  query?: Record<string, string | null>
}

// url = pathname + search query
export function getPageDetails(url: string): PageDetails {
  const [pathname, query] = url.split('?')
  const searchParams = new URLSearchParams(query)
  const [_, page, firstParam, subPage, secondParam] = pathname.split('/')

  if (page === 'posts' && firstParam in MAP_POST_SLUG_TO_TAG) {
    const pageTag = MAP_POST_SLUG_TO_TAG[firstParam as keyof typeof MAP_POST_SLUG_TO_TAG]
    // redirect if projectSlug cannot be resolved
    return {
      tagName: pageTag,
    }
  }

  return {
    tagName: PageTagName.Home,
  }
}

let isDuringTransition = false

export default function renderView(tagName: PageTagName, doneCallback: VoidFunction) {
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
    newView.classList.remove('delay')

    currView?.remove()

    document.main.classList.remove('in-transition')

    newView.removeEventListener("transitionend", removeArtifacts);
    isDuringTransition = false
    doneCallback()
  }

  newView.addEventListener("transitionend", removeArtifacts);
}