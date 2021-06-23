"use strict";

class ImageViewer {
  constructor () {
    this.display_options = Storage().display
  }

  set (image) {
    if (typeof image === "undefined") return console.error("no image provided to viewer#set")
    const url = image.url
    document.querySelector('background').style.setProperty("background-image", `url(${url})`)
    this.showInfo(image)
  }

  infoBoxToggly(){
    if (this.display_options.show_info) {
      document.querySelector('info').style.display = ""
    } else {
      document.querySelector('info').style.display = "none"
    }
  }

  tick() {
    this.setBezelPersistence()
    this.updateClock()
    this.infoBoxToggly()
  }

  preloadHistory(image) {
    let img = Builder.img(image)
    document.querySelector('prefetch').appendChild(img)
  }

  async setBezelPersistence(){
    document.querySelector('sidebar').classList.remove('subtle', 'aggressive', 'demanding')
    document.querySelector('sidebar').classList.add(this.display_options.info_persistence.toLowerCase())
  }

  async updateClock(){
    const now = new Date()
    this.updateTime(now)
    this.updateDate(now)

    if (this.display_options.show_clock) {
      document.querySelector('time').style.display = ""
    } else {
      document.querySelector('time').style.display = "none"
    }

    if (this.display_options.show_date) {
      document.querySelector('date').style.display = ""
    } else {
      document.querySelector('date').style.display = "none"
    }

    if (this.display_options.show_clock && this.display_options.show_date) {
      document.querySelector('clock').classList.add('top_border')
    } else {
      document.querySelector('clock').classList.remove('top_border')
    }

    if (this.display_options.show_clock || this.display_options.show_date) {
      document.querySelector('clock').style.display = ""
    } else {
      document.querySelector('clock').style.display = "none"
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

    document.querySelector('time').textContent = time
  }

  updateDate(now) {
    let date = ""

    if (this.display_options.date_format == "good") {
      date = terse_date(now)
    } else {
      date = verbose_date(now)
    }

    document.querySelector('date').textContent = date
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

    document.querySelector('info name').appendChild(
      Builder.link(item.external_url, title)
    )
    document.querySelector('info by-line').appendChild(
      Builder.link(item.author.url, `by ${item.author.name}`)
    )
    document.querySelector('info venue').appendChild(
      Builder.link(item._meta.venue.url, `on ${item._meta.venue.name}`)
    )

    if (item._meta.camera_settings) {
      if (item._meta.camera_settings.f)
        document.querySelector('info camera').appendChild(
          Builder.tag('aperture', item._meta.camera_settings.f)
        )

      if (item._meta.camera_settings.iso)
        document.querySelector('info camera').appendChild(
          Builder.tag('iso', item._meta.camera_settings.iso)
        )

      if (item._meta.camera_settings.shutter_speed)
        document.querySelector('info camera').appendChild(
          Builder.tag('shutter', item._meta.camera_settings.shutter_speed)
        )
    }

    if (item._meta.camera) {
      if (item._meta.camera.aperture)
        document.querySelector('info camera').appendChild(
          Builder.tag('aperture', `ƒ/${item._meta.camera.aperture}`)
        )

      if (item._meta.camera.iso)
        document.querySelector('info camera').appendChild(
          Builder.tag('iso', `ISO ${item._meta.camera.iso}`)
        )

      if (item._meta.camera.shutter_speed)
        document.querySelector('info camera').appendChild(
          Builder.tag('shutter', `${item._meta.camera.shutter_speed}s`)
        )
    }
  }
}
