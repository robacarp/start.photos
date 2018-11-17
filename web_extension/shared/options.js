'use strict';

class Options {
  constructor() {
    this.version = 1
    this.display_options = (new DisplayOptions(this))
    this.photo_history = (new PhotoHistory(this))
    this.feed_options = (new FeedOptions(this))
    this.photo_cache = (new PhotoCache(this))

    this.fetched = false
  }

  async read () {
    const promise = browser.storage.sync.get()
    const stored_options = await promise

    // upgrade from version 0 options, without namespacing
    let stored_version = 0
    if (stored_options.version)
      stored_version = stored_options.version

    if (stored_version == 0)
      this.display_options.fetch(stored_options)


    // proceed as usual with versioned options
    if (stored_options.display_options)
      this.display_options.fetch(stored_options.display_options)

    if (stored_options.feed_options)
      this.feed_options.fetch(stored_options.feed_options)

    if (stored_options.photo_history)
      this.photo_history.fetch(stored_options.photo_history)

    this.fetched = true
    return Promise.all([ this.cache.read(), promise ])
  }

  get display() { return this.display_options }
  get history() { return this.photo_history }
  get feed()    { return this.feed_options }
  get cache()   { return this.photo_cache }

  async write () {
    return browser.storage.sync.set(this)
  }
}

class OptionsSubset {
  fetch (raw_options) {
    for (let field of Object.getOwnPropertyNames(this))
      if (raw_options[field] !== undefined)
        this[field] = raw_options[field]
  }
}

class DisplayOptions extends OptionsSubset {
  constructor() {
    super()
    this.show_clock = true
    this.show_date = true
    this.show_seconds = false
    this.show_info = true

    this.twentyfour_hour_clock = true
    this.clock_persistence = "Subtle"
    this.info_persistence = "Subtle"
    this.clock_flash = false
    this.date_format = "good"
  }
}

class FeedOptions extends OptionsSubset {
  constructor () {
    super()
    this.url = "https://robacarp.github.io/photographic_start/feed.json"
    this.refresh_interval = "always"
  }
}

class PhotoHistory extends OptionsSubset {
  constructor () {
    super()
    this.history = []
  }

  increment (photo) {
    const history_item = this.history.find(item => photo.id == item.id)
    const now = (new Date()).toJSON()

    if (history_item) {
      history_item.seen_count += 1
      history_item.last_seen_at = now
    } else {
      this.history.push({
        "id" : photo.id,
        "last_seen_at" : now,
        "seen_count" : 1
      })
    }
  }
}

class PhotoCache {
  constructor () {
    this.items = []
    this.last_new_image = 0 // "early" epoch timestamp
    this.fetched = false
  }

  async read () {
    const stored_options = await browser.storage.local.get()
    this.items = stored_options.items

    if (! Array.isArray(this.items))
      this.items = []

    if (stored_options.last_new_image)
      this.last_new_image = stored_options.last_new_image

    this.fetched = true
  }

  async write () {
    return browser.storage.local.set(this)
  }

  push (photo) {
    const already_exists = this.items.findIndex(cached => cached.id == photo.id)

    if (already_exists != -1)
      return

    photo.cached_at = (new Date()).toJSON()

    this.items.push(photo)
    this.write()
  }

  pop () {
    let item = this.items[0]
    const now = (new Date()).getTime()

    if (now - this.last_new_image > 5000) {
      this.items.shift()
      this.last_new_image = now
    }

    this.write()
    return item
  }

  get count () { return this.items.length }
}
