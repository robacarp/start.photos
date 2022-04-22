"use strict";

import Sector from '../lib/sector.js'
import Version from '../version.js'

export default class FeedOptions extends Sector {
  constructor (options) {
    super(options)

    this.feed_url = null
    this.custom_feed_enabled = false
    this.default_feed_url = "https://start.photos/feed.json"
    this.legacy_feed_url = "https://robacarp.github.io/photographic_start/feed.json"

    if (typeof window.sent_development_warning == "undefined")
      window.sent_development_warning = false
  }

  get storedProperties() {
    return new Set([
      "feed_url",
      "custom_feed_enabled"
    ])
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

  get searchUrls () {
    const urls = [this.default_feed_url, this.legacy_feed_url]

    if (this.custom_feed_enabled && this.custom_feed_url)
      urls.unshift(this.feed_url)

    if (Version.number == "Dev") {
      this.send_developer_warning()
      urls.unshift("http://127.0.0.1:4567/feed.json")
    }

    return urls
  }

  set url (new_url) {
    this.feed_url = new_url
  }

  set custom_feed (enabled) {
    this.custom_feed_enabled = enabled
  }

  send_developer_warning() {
    if (window.sent_development_warning) return
    window.sent_development_warning = true
    console.warn("Development feed override active.")
  }
}
