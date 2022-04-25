"use strict";

import Builder from '../lib/builder.js'
import Storage from '../storage_manager.js'
import TimeFmt from '../lib/time_fmt.js'

export default class InfoBox extends HTMLElement {
  constructor () {
    super()
    this.display_options = Storage.display
    this.attachShadow({ mode: 'open' })

    this.attachCSS()
    this.attachHTML()
  }

  update(image) {
    this.showInfo(image)
  }

  connectedCallback() {
    setInterval(this.tick.bind(this), 1000)
  }

  attachCSS() {
    const linkElem = document.createElement('link')
    linkElem.setAttribute('rel', 'stylesheet')
    linkElem.setAttribute('href', '../shared/info-box/info-box.css')
    this.shadowRoot.appendChild(linkElem);
  }

  attachHTML() {
    const parser = new DOMParser()
    const fragment = document.createDocumentFragment()

    fetch('../shared/info-box/info-box.html')
      .then(response => response.text())
      .then(html => parser.parseFromString(html, 'text/html'))
      .then(parsed => {
        fragment.appendChild(parsed.documentElement)
        this.shadowRoot.appendChild(fragment)
      })
  }

  infoBoxToggly(){
    if (this.display_options.show_info) {
      this.shadowRoot.querySelector('info').style.display = ""
    } else {
      this.shadowRoot.querySelector('info').style.display = "none"
    }
  }

  tick() {
    this.setBezelPersistence()
    this.updateClock()
    this.infoBoxToggly()
  }

  async setBezelPersistence(){
    this.shadowRoot.querySelector('bezel').classList.remove('subtle', 'aggressive', 'demanding')
    this.shadowRoot.querySelector('bezel').classList.add(this.display_options.info_persistence.toLowerCase())
  }

  async updateClock(){
    const now = new Date()
    this.updateTime(now)
    this.updateDate(now)

    if (this.display_options.show_clock) {
      this.shadowRoot.querySelector('time').style.display = ""
    } else {
      this.shadowRoot.querySelector('time').style.display = "none"
    }

    if (this.display_options.show_date) {
      this.shadowRoot.querySelector('date').style.display = ""
    } else {
      this.shadowRoot.querySelector('date').style.display = "none"
    }

    if (this.display_options.show_clock && this.display_options.show_date) {
      this.shadowRoot.querySelector('clock').classList.add('top_border')
    } else {
      this.shadowRoot.querySelector('clock').classList.remove('top_border')
    }

    if (this.display_options.show_clock || this.display_options.show_date) {
      this.shadowRoot.querySelector('clock').style.display = ""
    } else {
      this.shadowRoot.querySelector('clock').style.display = "none"
    }
  }

  updateTime(now) {
    let time = ""
    let sep = ":"

    if (this.display_options.clock_flash && now.getSeconds() % 2 == 0)
      sep = " "

    let hour = now.getHours()
    if (this.display_options.twentyfour_hour_clock) {
      if (hour < 10) hour = "0" + hour
    } else {
      if (hour > 12) hour -= 12
    }
    time += hour
    time += sep

    let minute = now.getMinutes()
    if (minute < 10) minute = "0" + minute
    time += minute

    if (this.display_options.show_seconds) {
      let second = now.getSeconds()
      if (second < 10) second = "0" + second
      time += sep
      time += second
    }

    this.shadowRoot.querySelector('time').textContent = time
  }

  updateDate(now) {
    let date = ""

    if (this.display_options.date_format == "good") {
      date = TimeFmt.terseDate(now)
    } else {
      date = TimeFmt.verboseDate(now)
    }

    this.shadowRoot.querySelector('date').textContent = date
  }

  showInfo(item) {
    let title = (item.content_text || "untitled")

    if (title.length > 50) {
      let first_fifty = title.substring(0,50)
      let a_space = first_fifty.lastIndexOf(' ')

      if (a_space < 0)
        a_space = 50

      title = title.substring(0, a_space) + "..."
    }

    ['camera', 'by-line', 'name', 'venue'].forEach(selector => {
      this.shadowRoot.querySelector('info')
              .querySelector(selector)
              .querySelectorAll('*')
              .forEach(element => element.remove())
    })

    this.shadowRoot.querySelector('info name').appendChild(
      Builder.link(item.external_url, title)
    )
    this.shadowRoot.querySelector('info by-line').appendChild(
      Builder.link(item.author.url, `by ${item.author.name}`)
    )
    this.shadowRoot.querySelector('info venue').appendChild(
      Builder.link(item._meta.venue.url, `on ${item._meta.venue.name}`)
    )

    if (item._meta.camera_settings) {
      if (item._meta.camera_settings.f)
        this.shadowRoot.querySelector('info camera').appendChild(
          Builder.tag('aperture', item._meta.camera_settings.f)
        )

      if (item._meta.camera_settings.iso)
        this.shadowRoot.querySelector('info camera').appendChild(
          Builder.tag('iso', item._meta.camera_settings.iso)
        )

      if (item._meta.camera_settings.shutter_speed)
        this.shadowRoot.querySelector('info camera').appendChild(
          Builder.tag('shutter', item._meta.camera_settings.shutter_speed)
        )
    }

    if (item._meta.camera) {
      if (item._meta.camera.aperture)
        this.shadowRoot.querySelector('info camera').appendChild(
          Builder.tag('aperture', `ƒ/${item._meta.camera.aperture}`)
        )

      if (item._meta.camera.iso)
        this.shadowRoot.querySelector('info camera').appendChild(
          Builder.tag('iso', `ISO ${item._meta.camera.iso}`)
        )

      if (item._meta.camera.shutter_speed)
        this.shadowRoot.querySelector('info camera').appendChild(
          Builder.tag('shutter', `${item._meta.camera.shutter_speed}s`)
        )
    }
  }
}

customElements.define('info-box', InfoBox)
