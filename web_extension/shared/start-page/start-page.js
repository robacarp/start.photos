"use strict";

import Builder from '../lib/builder.js'
import Version from '../version.js'
import ImageChooser from '../../shared/image_chooser.js'

export default class StartPage extends HTMLElement {
  constructor () {
    super()
    this.chooser = new ImageChooser()
    this.attachShadow({ mode: 'open' })

    this.attachCSS()
    this.attachHTML()
  }

  connectedCallback() {
    this.chooser.choose().then(image => this.set(image))
  }

  set (image) {
    if (typeof image === 'undefined') return console.error('no image provided to viewer#set')
    const url = image.url

    this.shadowRoot
      .querySelector('background')
      .style
      .setProperty('background-image', `url(${url})`)

    this.dispatchEvent(new CustomEvent('image-changed', { detail: image }))
    // this.showInfo(image)
  }

  preloadHistory(image) {
    let img = Builder.img(image)
    this.shadowRoot.querySelector('prefetch').appendChild(img)
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
