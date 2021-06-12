'use strict';

class OptionsStorage {
  constructor() {
    this.version = 1
    this.display_options = (new DisplayOptions(this))
    this.photo_history = (new PhotoHistory(this))
    this.feed_options = (new FeedOptions(this))
    this.photo_cache = (new PhotoCache(this))

    this.fetched = false
  }

  async read () {
    const local = browser.storage.local.get()
    const sync = browser.storage.sync.get()

    // read from local storage, fall back to sync'd storage
    let stored_options = await local
    if (! stored_options.version) {
      console.warn("Reading from local storage failed. Reading from sync'd storage.")
      stored_options = await sync
    }

    this.display_options.fetch(stored_options.display_options)
    this.feed_options.fetch(stored_options.feed_options)
    this.photo_history.fetch(stored_options.photo_history)
    this.photo_cache.fetch(stored_options.photo_cache)

    this.fetched = true
    return Promise.all([ this.cache.read(), stored_options ])
  }

  get writableConfig() {
    return {
      version: this.version,
      display_options: this.display,
      photo_history: this.history,
      feed_options: this.feed.writable_config,
      photo_cache: this.cache.synchronized_config
    }
  }

  get display() { return this.display_options }
  get history() { return this.photo_history }
  get feed()    { return this.feed_options }
  get cache()   { return this.photo_cache }

  async write () {
    return browser.storage.local.set(this.writableConfig)
  }
}

class OptionsSubset {
  fetch (raw_options) {
    if (! raw_options) return

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
    this.info_persistence = "Subtle"
    this.clock_flash = false
    this.date_format = "good"
  }
}

class FeedOptions extends OptionsSubset {
  constructor () {
    super()
    this.feed_url = "https://robacarp.github.io/photographic_start/feed.json"
    this.legacy_feed_url = "https://robacarp.github.io/photographic_start/feed.json"

    if (typeof window.sent_development_warning == "undefined")
      window.sent_development_warning = false
  }

  get url () {
    if (Version.number == "Dev") {
      this.send_developer_warning()
      return "http://127.0.0.1:4567/feed.json"
    } else {
      return this.feed_url
    }
  }

  set url (new_url) {
    this.feed_url = new_url
  }

  get writable_config() {
    return { url: this.feed_url }
  }

  send_developer_warning() {
    if (window.sent_development_warning)
      return
    window.sent_development_warning = true
    console.warn("Development feed override active.")
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

class PhotoCache extends OptionsSubset {

  constructor () {
    super()
    this.items = []
    this.last_new_image = 0 // "early" epoch timestamp
    this.refresh_interval = "5s"
    this.depth = 3
    this.fetched = false
  }

  get computed_refresh_interval() {
    switch (this.refresh_interval) {
      case "5s": return 5000
      case "1m": return 60000
      case "1h": return 3600000
      case "1d": return 86400000
    }
  }

  get synchronized_config() {
    return {
      refresh_interval: this.refresh_interval,
      depth: this.cache_depth
    }
  }

  async read () {
    if (this.fetched) return;
    this.fetched = true

    const stored_options = await browser.storage.local.get()
    this.items = stored_options.items

    if (! Array.isArray(this.items))
      this.items = []

    if (stored_options.last_new_image)
      this.last_new_image = stored_options.last_new_image
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

    if (now - this.last_new_image > this.computed_refresh_interval) {
      this.items.shift()
      item = this.items[0]
      this.last_new_image = now
    }

    this.write()
    return item
  }

  get count () { return this.items.length }
}

const options_instance = new OptionsStorage()
const Options = () => options_instance;
