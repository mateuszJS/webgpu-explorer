import updateView from "./updateView";

export default function attachInternalLink(a: HTMLAnchorElement, pathname: string) {
  a.addEventListener('click', () => {
    window.history.pushState({}, pathname, window.location.origin + pathname);
    updateView(pathname)
    return false
  })
}