"use strict";


export default class SettingsPage extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.attachCSS()
    this.attachHTML()
  }

  async attachCSS() {
    const linkElem = document.createElement('link')
    linkElem.setAttribute('rel', 'stylesheet')
    linkElem.setAttribute('href', '../shared/settings_page/style.css')
    this.shadowRoot.appendChild(linkElem);
  }

  async attachHTML() {
    const parser = new DOMParser()
    const fragment = document.createDocumentFragment()

    fetch('../shared/settings_page/settings_page.html')
      .then(response => response.text())
      .then(html => parser.parseFromString(html, 'text/html'))
      .then(parsed => {
        fragment.appendChild(parsed.documentElement)
        this.shadowRoot.appendChild(fragment)
      })
  }
}

customElements.define('settings-page', SettingsPage)
