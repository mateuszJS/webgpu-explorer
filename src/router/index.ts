// async function loadPage(page: string) {
//   const response = await fetch(page);
//   const resHtml = await response.text();
//   return resHtml;
// };

import updateView from "./updateView";

// const loadAllPages = async () => {
//   home = await loadPage('home.html');
//   about = await loadPage('about.html');
//   contact = await loadPage('contact.html');
// };

// const ROUTES = {
//   '/': 
// }

export default function initRouter() {

  // handles back and forward history buttons in browser
  window.onpopstate = () => {
    updateView(window.location.pathname)
  };

  updateView(window.location.pathname)
}
