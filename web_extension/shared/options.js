'use strict';

class Options {
  constructor() {
    this.version = 1
    this.display_options = (new DisplayOptions(this))
    this.feed_options = (new FeedOptions(this))

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

    this.fetched = true

    return promise
  }

  get display() { return this.display_options }
  get history() { return this.photo_history }
  get feed()    { return this.feed_options }

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
  }
}
