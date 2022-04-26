"use strict";

export default class BaseComponent extends HTMLElement {
  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
    this.domAttached = false
  }

  attachCSS(path) {
    const linkElem = document.createElement('link')
    linkElem.setAttribute('rel', 'stylesheet')
    linkElem.setAttribute('href', path)
    this.shadowRoot.appendChild(linkElem);
  }

  async attachHTML(path) {
    const parser = new DOMParser()
    const fragment = document.createDocumentFragment()

    return fetch(path)
      .then(response => response.text())
      .then(html => parser.parseFromString(html, 'text/html'))
      .then(parsed => {
        fragment.appendChild(parsed.documentElement)
        this.shadowRoot.appendChild(fragment)
      })
      .then(() => {
        this.domAttached = true
        this.dispatchEvent(new CustomEvent('DomAttached'))
        this.readyCallback()
      })
  }

  readyCallback() { }

  waitForReady(fn) {
    if (this.domAttached) {
      fn()
    } else {
      this.addEventListener(
        'DomAttached', () => fn(),
        { once: true, passive: true }
      )
    }
  }
}
