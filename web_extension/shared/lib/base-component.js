"use strict";

export default class BaseComponent extends HTMLElement {
  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
  }

  attachCSS(path) {
    const linkElem = document.createElement('link')
    linkElem.setAttribute('rel', 'stylesheet')
    linkElem.setAttribute('href', path)
    this.shadowRoot.appendChild(linkElem);
  }

  attachHTML(path) {
    const parser = new DOMParser()
    const fragment = document.createDocumentFragment()

    fetch(path)
      .then(response => response.text())
      .then(html => parser.parseFromString(html, 'text/html'))
      .then(parsed => {
        fragment.appendChild(parsed.documentElement)
        this.shadowRoot.appendChild(fragment)
      })
  }

}
