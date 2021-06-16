"use strict";

class PhotoChooserEngine {
  constructor () {
    this.feed_options = Options().feed_options
    this.history_manager = Options().history_manager

    this.fetched_feed
    this.feed_fetched = false
    this.parsed_feed = null
  }

  async downloadFeed () {
    let result
    await this.feed_options.ensureRead()
    const urls = [this.feed_options.url, this.feed_options.legacy_feed_url]

    while (urls.length > 0) {
      const url = urls.shift()
      console.info(`Fetching feed data from ${url}.`)
      result = await this.fetchFeed(url)
      if (result) break
      console.error(`could not fetch from ${url}`)
    }

    console.info(`${result.length} total images in feed`)
    this.fetched_feed = result
  }

  async fetchFeed (url) {
    return fetch(
        url, { redirect: "follow", referrer: "no-referrer", credentials: "omit" }
      )
    .then(feed => feed.json())
    .then(feed => feed.items)
    .catch(function(e) {
      console.error(e)
      return null
    })
  }

  async feed () {
    if (! this.feed_fetched) await this.downloadFeed()
    return this.fetched_feed
  }

  async pick () {
    // Pivot the feed of images by matching them up with history items
    // and then grouping by the number of times this browser has seen
    // the image.
    let sorted_images = []
    const feed = await this.feed()

    for (let feed_image of feed) {
      let history_image = this.history_manager.find(history_item => history_item.id == feed_image.id)

      let seen_count = 0
      if (history_image) seen_count = history_image.seen_count

      if (sorted_images[seen_count] === undefined)
        sorted_images[seen_count] = []

      sorted_images[seen_count].push(feed_image)
    }

    // The first slot in the array represents the collection of images
    // which have been viewed the fewest times.
    const seen_the_least = sorted_images.find(list => list && list.length > 0)

    if (! seen_the_least) return

    console.info(`Choosing from ${seen_the_least.length} images which have been seen the least.`)

    // Randomly choose one of the images which has been seen the least.
    const number = parseInt(Math.random() * seen_the_least.length)
    return seen_the_least[number]
  }
}

const photo_chooser_instance = new PhotoChooserEngine()
const PhotoChooser = () => photo_chooser_instance
