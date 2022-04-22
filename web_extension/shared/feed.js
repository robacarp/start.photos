"use strict";

class PhotoFeed {
  constructor () {
    this.feed_options = Storage().feed_options
    this.fetched = false
    this.parsed_feed = null
  }

  async ensureFetched () {
    if (! this.feed_fetched) await this.downloadFeed()
    return this.fetched_feed
  }

  async downloadFeed () {
    let result
    await this.feed_options.ensureRead()
    const urls = this.feed_options.searchUrls

    while (urls.length > 0) {
      const url = urls.shift()
      console.info(`Fetching feed data from ${url}.`)
      result = await this.fetchFeed(url)
      if (result) break
    }

    console.info(`${result.length} total images in feed`)
    this.parsed_feed = result
  }

  async fetchFeed (url) {
    if (typeof url == "undefined") return

    return fetch(
        url, { redirect: "follow", referrer: "no-referrer", credentials: "omit" }
      )
    .then(feed => feed.json())
    .then(feed => feed.items)
    .catch((e) => {
      console.error(`Error fetching feed (${url}):`, e)
      return null
    })
  }

  get images () {
    return this.parsed_feed
  }

  find(image_id) {
    return this.images.find(image => image.id == image_id)
  }
}

const photo_feed = new PhotoFeed()
const Feed = () => photo_feed
