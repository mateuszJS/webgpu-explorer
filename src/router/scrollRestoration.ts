const HISTORY_SCROLL_KEY = '__viewScrollTop'

function getScrollContainer(type: 'new' | 'old') {
  const oldestView = document.querySelector<HTMLDivElement>(
    type === 'new' ? '.view:last-of-type' : '.view'
  )
  // there may be new and odler view, first child is older
  if (!oldestView) {
    throw new Error('No .view element found in document.main')
  }

  return oldestView
}

function readHistoryScrollTop() {
  const state = window.history.state as Record<string, number>
  if (state && typeof state === 'object' && typeof state[HISTORY_SCROLL_KEY] === 'number') {
    return state[HISTORY_SCROLL_KEY]
  }
  return 0
}

export function saveScrollPosition() {
  const currState = window.history.state as unknown
  const newState = {
    ...(typeof currState === 'object' ? currState : {}),
    [HISTORY_SCROLL_KEY]: getScrollContainer('old').scrollTop,
  }
  window.history.replaceState(newState, '')
}

export function restoreScrollPosition() {
  const scrollContainer = getScrollContainer('new')
  if (scrollContainer) {
    scrollContainer.scrollTop = readHistoryScrollTop()
    // scrollContainer.scrollTo({
    //   top: readHistoryScrollTop(),
    //   behavior: 'smooth',
    // })
  }
}

export function initScrollRestoration() {
  window.history.scrollRestoration = 'manual'

  // beforeunload doesn't always trigger, is unreiable, epsecially on mobile when user view different app tha browser and then clsoes browser
  // thats why visibilitychange is used as well
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      saveScrollPosition()
    }
  })
  window.addEventListener('beforeunload', saveScrollPosition)
}
