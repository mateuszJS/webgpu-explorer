export default function getTemplate(html: string) {
  const tmpl = document.createElement('template')
  tmpl.innerHTML = html
  return tmpl
}