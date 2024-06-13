export interface NavItem {
  title: string
  description?: string
}

export interface Nav {
  title: string
  descriptionShort: string
  descriptionLong: string
  nav: NavItem[]
  files: string[]
}

export interface Base5Json {
  default: Nav
}