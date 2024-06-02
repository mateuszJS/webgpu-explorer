export interface NavItem {
  title: string
  description?: string
}

export interface Nav {
  title: string
  descriptionShort: string
  descriptionLong: string
  nav: NavItem[]
}

export interface Base5Json {
  default: Nav
}