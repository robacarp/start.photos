"use strict";

import Builder from '../lib/builder.js'
import Version from '../version.js'
import ImageChooser from '../../shared/image_chooser.js'

export default class StartPage extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })

    this.attachCSS()
    this.attachHTML()
  }

  set image (image) {
    if (typeof image === 'undefined') return console.error('no image provided to viewer#set')

    this.shadowRoot.querySelector('background')
      .style
      .setProperty('background-image', `url(${image.url})`)
  }

  preloadHistory(image) {
    this.shadowRoot.querySelector('prefetch').appendChild(Builder.img(image))
  }

  attachCSS() {
    const linkElem = document.createElement('link')
    linkElem.setAttribute('rel', 'stylesheet')
    linkElem.setAttribute('href', '../shared/start-page/start-page.css')
    this.shadowRoot.appendChild(linkElem);
  }

  attachHTML() {
    const parser = new DOMParser()
    const fragment = document.createDocumentFragment()

    fetch('../shared/start-page/start-page.html')
      .then(response => response.text())
      .then(html => parser.parseFromString(html, 'text/html'))
      .then(parsed => {
        fragment.appendChild(parsed.documentElement)
        this.shadowRoot.appendChild(fragment)
      })
  }
}

customElements.define('start-page', StartPage)
