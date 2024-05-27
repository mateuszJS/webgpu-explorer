import initRouter from 'router'
import resetCSS from './styles/reset.css'
import baseCSS from './styles/base.css'
import BaseElement from 'BaseElement'

BaseElement.attachCSS(resetCSS)
BaseElement.attachCSS(baseCSS)
initRouter()
