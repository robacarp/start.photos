class FeedOptions extends Sector {
  constructor (options) {
    super(options)
    this.feed_url = "https://robacarp.github.io/photographic_start/feed.json"
    this.legacy_feed_url = "https://robacarp.github.io/photographic_start/feed.json"

    if (typeof window.sent_development_warning == "undefined")
      window.sent_development_warning = false
  }

  get storedProperties() {
    return new Set([
      "feed_url",
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

  set url (new_url) {
    this.feed_url = new_url
  }

  send_developer_warning() {
    if (window.sent_development_warning)
      return
    window.sent_development_warning = true
    console.warn("Development feed override active.")
  }
}

