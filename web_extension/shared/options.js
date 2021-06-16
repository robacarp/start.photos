'use strict';

class OptionsManager {
  constructor() {
    this.version = 1
    this.display_options = (new DisplayOptions())
    this.photo_history = (new PhotoHistory())
    this.feed_options = (new FeedOptions())
    this.photo_cache = (new PhotoCache())
  }

  read() {
    Promise.all([
      this.display.read(),
      this.history_manager.read(),
      this.feed.read(),
      this.cache.read()
    ])
  }

  get display() { return this.display_options }
  get history_manager() { return this.photo_history }
  get feed()    { return this.feed_options }
  get cache()   { return this.photo_cache }
}

class OptionsSubset {
  constructor() {
    this.fetched = false
  }

  // Overrideable method.
  // Indicates which browser storage sector is used to persist
  // configuration data for the current class.
  get storage_area() {
    return "local"
  }

  // Returns the browser storage namespace for the current class.
  get storage_name() {
    return this.__proto__.constructor.name
  }

  // Overrideable method.
  // Returns a list of properties which should be persisted when
  // the config object is written to browser storage.
  configProperties() {
    return Object.getOwnPropertyNames(this)
  }

  // Creates the formatted object for writing to browser storage
  writableConfig() {
    let config = {}
    for (let field of this.configProperties())
      config[field] = this[field]

    delete config.fetched

    const writable = {}
    writable[this.storage_name] = config
    return writable
  }

  // Overrideable method.
  // Hydrates an object from local storage.
  populateWithConfig(config) {
    for (let field of this.configProperties())
      if (config[this.storage_name] && typeof config[this.storage_name][field] !== undefined)
        this[field] = config[this.storage_name][field]
  }

  // Ensures that the configuration object has been read from
  // browser storage.
  async ensureRead() {
    this.fetched || this.read()
  }

  // Read the configuration object from storage and hydrate object properties.
  async read () {
    console.info(`Reading ${this.storage_name} from ${this.storage_area}`)
    const stored_options = await browser.storage[this.storage_area].get()

    this.populateWithConfig(stored_options)
    this.fetched = true
    return this
  }

  // Write the configuration object to storage.
  async write () {
    console.info(`Writing ${this.storage_name} to ${this.storage_area}`)
    return browser.storage[this.storage_area].set(this.writableConfig())
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

  // Display options are persisted to sync storage for visual consistency
  // across all browsers a user is logged into.
  get storage_area () { return "sync" }
}

class FeedOptions extends OptionsSubset {
  constructor (options) {
    super(options)
    this.feed_url = "https://robacarp.github.io/photographic_start/feed.json"
    this.legacy_feed_url = "https://robacarp.github.io/photographic_start/feed.json"

    if (typeof window.sent_development_warning == "undefined")
      window.sent_development_warning = false
  }

  // Feed options are persisted to sync storage for visual consistency
  // across all browsers a user is logged into.
  get storage_area () { return "sync" }

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
    this.find = this.history.find
  }

  configProperties () {
    return super.configProperties()
                .filter(e => { return e != "find" })
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

    this.write()
  }
}

class PhotoCache extends OptionsSubset {
  constructor (options) {
    super(options)
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

const options_manager = new OptionsManager()
const Options = () => options_manager;
