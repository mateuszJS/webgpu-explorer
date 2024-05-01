"use strict";(self.webpackChunkwebgpu_explorer=self.webpackChunkwebgpu_explorer||[]).push([[792],{407:()=>{eval("// extracted by mini-css-extract-plugin\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNDA3LmpzIiwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2ViZ3B1LWV4cGxvcmVyLy4vc3JjL3N0eWxlcy9pbmRleC5zY3NzPzM4YTUiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///407\n")},171:(__unused_webpack_module,__unused_webpack___webpack_exports__,__webpack_require__)=>{eval("\n;// CONCATENATED MODULE: ./src/components/project-panel/icons/start-icon.png\nconst start_icon_namespaceObject = __webpack_require__.p + \"97d59c38baa29224b3fb.png\";\n;// CONCATENATED MODULE: ./src/components/project-panel/icons/triangle-icon.png\nconst triangle_icon_namespaceObject = __webpack_require__.p + \"48b88e6573da7f74b3a9.png\";\n;// CONCATENATED MODULE: ./src/components/project-panel/template.html\nconst template_namespaceObject = \"<style>\\n  :host {\\n    display: block;\\n    border: 3px solid gray;\\n    border-radius: 5px;\\n    background: black;\\n  }\\n  a {\\n    color: white; \\n    display: flex;\\n    text-decoration: none;\\n  }\\n  img {\\n    width: 50px;\\n    height: 50px;\\n  }\\n</style>\\n<a>\\n  <img />\\n  <div>\\n    <h3><slot name=\\\"title\\\">DEFAULT TITLE</slot></h3>\\n    <p><slot name=\\\"text\\\">DEFAULT TITLE</slot></p>\\n  </div>\\n</a>\";\n;// CONCATENATED MODULE: ./src/components/project-panel/index.ts\n\n\n\nconst MAP_IMG_SRC = {\n    background: start_icon_namespaceObject,\n    triangle: triangle_icon_namespaceObject,\n};\nlet tmpl = document.createElement('template');\ntmpl.innerHTML = template_namespaceObject;\nclass ProjectPanel extends HTMLElement {\n    constructor() {\n        super();\n        // Attach a shadow root to the element.\n        const shadowRoot = this.attachShadow({ mode: 'open' });\n        shadowRoot.appendChild(tmpl.content.cloneNode(true));\n        shadowRoot.querySelector('a').setAttribute('href', `#${this.getAttribute('project-slug')}`);\n        shadowRoot.querySelector('img').setAttribute('src', MAP_IMG_SRC[this.getAttribute('icon')]);\n    }\n}\nwindow.customElements.define('project-panel', ProjectPanel);\n\n;// CONCATENATED MODULE: ./src/index.ts\n\n// const sections = Array.from(\n//   document.querySelectorAll('.view')\n// )\n// let currSectionIndex = 0\n// let lastScrollTop = 0\n// let durignTransition = false\n// function onScroll() {\n//   const scrollTop = mainNode.scrollTop\n//   if (scrollTop > lastScrollTop) {\n//     // downscroll code\n//  } else if (scrollTop < lastScrollTop) {\n//     // upscroll code\n//  } // else was horizontal scroll\n//  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling\n// }\n// const mainNode = document.querySelector('main')!\n// mainNode.addEventListener('scroll', onScroll)\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTcxLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQThDO0FBQ007QUFDbEI7QUFFbEMsTUFBTSxXQUFXLEdBQUc7SUFDbEIsVUFBVSxFQUFFLDBCQUFTO0lBQ3JCLFFBQVEsRUFBRSw2QkFBWTtDQUN2QjtBQUVELElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDOUMsSUFBSSxDQUFDLFNBQVMsR0FBRyx3QkFBSSxDQUFDO0FBRXRCLE1BQU0sWUFBYSxTQUFRLFdBQVc7SUFDcEM7UUFDRSxLQUFLLEVBQUU7UUFFUCx1Q0FBdUM7UUFDdkMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO1FBQ3JELFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUVyRCxVQUFVLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUM7UUFDNUYsVUFBVSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUUsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBNkIsQ0FBQyxDQUFDO0lBQzFILENBQUM7Q0FDRjtBQUVELE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxZQUFZLENBQUMsQ0FBQzs7O0FDekJ6QjtBQUVuQywrQkFBK0I7QUFDL0IsdUNBQXVDO0FBQ3ZDLElBQUk7QUFDSiwyQkFBMkI7QUFDM0Isd0JBQXdCO0FBQ3hCLCtCQUErQjtBQUUvQix3QkFBd0I7QUFDeEIseUNBQXlDO0FBRXpDLHFDQUFxQztBQUNyQyx5QkFBeUI7QUFDekIsMkNBQTJDO0FBQzNDLHVCQUF1QjtBQUN2QixtQ0FBbUM7QUFDbkMsdUZBQXVGO0FBR3ZGLElBQUk7QUFFSixtREFBbUQ7QUFDbkQsZ0RBQWdEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2ViZ3B1LWV4cGxvcmVyLy4vc3JjL2NvbXBvbmVudHMvcHJvamVjdC1wYW5lbC9pbmRleC50cz80ODY1Iiwid2VicGFjazovL3dlYmdwdS1leHBsb3Jlci8uL3NyYy9pbmRleC50cz9mZmI0Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzdGFydEljb24gZnJvbSAnLi9pY29ucy9zdGFydC1pY29uLnBuZydcbmltcG9ydCB0cmlhbmdsZUljb24gZnJvbSAnLi9pY29ucy90cmlhbmdsZS1pY29uLnBuZydcbmltcG9ydCBodG1sIGZyb20gJy4vdGVtcGxhdGUuaHRtbCdcblxuY29uc3QgTUFQX0lNR19TUkMgPSB7XG4gIGJhY2tncm91bmQ6IHN0YXJ0SWNvbixcbiAgdHJpYW5nbGU6IHRyaWFuZ2xlSWNvbixcbn1cblxubGV0IHRtcGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xudG1wbC5pbm5lckhUTUwgPSBodG1sO1xuXG5jbGFzcyBQcm9qZWN0UGFuZWwgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKClcblxuICAgIC8vIEF0dGFjaCBhIHNoYWRvdyByb290IHRvIHRoZSBlbGVtZW50LlxuICAgIGNvbnN0IHNoYWRvd1Jvb3QgPSB0aGlzLmF0dGFjaFNoYWRvdyh7bW9kZTogJ29wZW4nfSk7XG4gICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZCh0bXBsLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpKTtcblxuICAgIHNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcignYScpIS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBgIyR7dGhpcy5nZXRBdHRyaWJ1dGUoJ3Byb2plY3Qtc2x1ZycpfWApXG4gICAgc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKCdpbWcnKSEuc2V0QXR0cmlidXRlKCdzcmMnLCBNQVBfSU1HX1NSQ1t0aGlzLmdldEF0dHJpYnV0ZSgnaWNvbicpIGFzIGtleW9mIHR5cGVvZiBNQVBfSU1HX1NSQ10pXG4gIH1cbn1cblxud2luZG93LmN1c3RvbUVsZW1lbnRzLmRlZmluZSgncHJvamVjdC1wYW5lbCcsIFByb2plY3RQYW5lbCk7IiwiaW1wb3J0ICcuL2NvbXBvbmVudHMvcHJvamVjdC1wYW5lbCdcblxuLy8gY29uc3Qgc2VjdGlvbnMgPSBBcnJheS5mcm9tKFxuLy8gICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudmlldycpXG4vLyApXG4vLyBsZXQgY3VyclNlY3Rpb25JbmRleCA9IDBcbi8vIGxldCBsYXN0U2Nyb2xsVG9wID0gMFxuLy8gbGV0IGR1cmlnblRyYW5zaXRpb24gPSBmYWxzZVxuXG4vLyBmdW5jdGlvbiBvblNjcm9sbCgpIHtcbi8vICAgY29uc3Qgc2Nyb2xsVG9wID0gbWFpbk5vZGUuc2Nyb2xsVG9wXG5cbi8vICAgaWYgKHNjcm9sbFRvcCA+IGxhc3RTY3JvbGxUb3ApIHtcbi8vICAgICAvLyBkb3duc2Nyb2xsIGNvZGVcbi8vICB9IGVsc2UgaWYgKHNjcm9sbFRvcCA8IGxhc3RTY3JvbGxUb3ApIHtcbi8vICAgICAvLyB1cHNjcm9sbCBjb2RlXG4vLyAgfSAvLyBlbHNlIHdhcyBob3Jpem9udGFsIHNjcm9sbFxuLy8gIGxhc3RTY3JvbGxUb3AgPSBzY3JvbGxUb3AgPD0gMCA/IDAgOiBzY3JvbGxUb3A7IC8vIEZvciBNb2JpbGUgb3IgbmVnYXRpdmUgc2Nyb2xsaW5nXG5cblxuLy8gfVxuXG4vLyBjb25zdCBtYWluTm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21haW4nKSFcbi8vIG1haW5Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIG9uU2Nyb2xsKSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///171\n")}},c=>{var n=n=>c(c.s=n);n(171),n(407)}]);