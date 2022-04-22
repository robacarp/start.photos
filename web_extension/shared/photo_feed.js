"use strict";

import Storage from './storage_manager.js';

class PhotoFeed {
  constructor () {
    this.fetched = false
    this.parsed_feed = null
  }

  async ensureFetched () {
    if (! this.feed_fetched) await this.downloadFeed()
    return this.fetched_feed
  }

  async /*private*/ downloadFeed () {
    let result
    const feed_options = Storage.feed_options
    await feed_options.ensureRead()
    const urls = feed_options.searchUrls

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

export default new PhotoFeed()
