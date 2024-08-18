import { PageTagName } from "./renderView"

const IMPORTS_TREE: Record<string, string[]> = {/*IMPORTS-TREE-PLACEHOLDER*/}
// console.log(JSON.parse(JSON.stringify(IMPORTS_TREE)))

  /* webpackInclude: /\.json$/ */
  /* webpackExclude: /\.noimport\.json$/ */
  /* webpackChunkName: "my-chunk-name" */
  /* webpackMode: "lazy" */
  /* webpackPrefetch: true */
  /* webpackPreload: true */

function collectAllImports(moduleName: string): string[] {
  return IMPORTS_TREE[moduleName as keyof typeof IMPORTS_TREE]
    .flatMap(dependency => [dependency, ...collectAllImports(dependency)])
}

export default function importPage(pageName: PageTagName) {
  import(`pages/${pageName}/index.ts`)
  
  collectAllImports(pageName).forEach(dependencyName => {
    import(`components/${dependencyName}/index.ts`)
    // if we do jsut prefetch, then don't remove!!!!
    IMPORTS_TREE[dependencyName] = [] // to avoid importing again in the future
  })
// if we do jsut prefetch, then don't remove!!!!
  IMPORTS_TREE[pageName] = [] // to avoid importing again in the future
}
