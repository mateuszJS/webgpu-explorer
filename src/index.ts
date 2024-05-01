import initRouter from 'router'
import './components/project-panel'
import './components/code-viewer'


initRouter(document.querySelector('main')!)
// const sections = Array.from(
//   document.querySelectorAll('.view')
// )
// let currSectionIndex = 0
// let lastScrollTop = 0
// let durignTransition = false

// function onScroll() {
//   const scrollTop = mainNode.scrollTop

//   if (scrollTop > lastScrollTop) {
//     // downscroll code
//  } else if (scrollTop < lastScrollTop) {
//     // upscroll code
//  } // else was horizontal scroll
//  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling


// }

// const mainNode = document.querySelector('main')!
// mainNode.addEventListener('scroll', onScroll)