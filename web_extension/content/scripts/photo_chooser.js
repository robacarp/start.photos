"use strict";

class PhotoChooserEngine {
  constructor () {
    this.options = Options()

    this.fetched_feed
    this.feed_fetched = false
    this.parsed_feed = null
  }

  async downloadFeed () {
    let result
    const urls = [options.feed.url, options.feed.legacy_feed_url]

    while (urls.length > 0) {
      const url = urls.shift()
      console.log(`Fetching feed data from ${url}.`)
      result = await this.fetchFeed(url)
      if (result) break
      console.error(`could not fetch from ${url}`)
    }

    console.log(`${result.length} total images in feed`)
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
      let history_image = this.options.history.find(history_item => history_item.id == feed_image.id)

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

    console.log(`Choosing from ${seen_the_least.length} images which have been seen the least.`)

    // Randomly choose one of the images which has been seen the least.
    const number = parseInt(Math.random() * seen_the_least.length)
    return seen_the_least[number]
  }

  async prune () {
    let options = Options()
    await options.read()

    let items = await this.downloadFeed()

    console.log(`${items.length} images in feed`)
    console.log(`${options.photo_history.history.length} items in history`)

    for (let history_image of options.photo_history.history) {
      let feed_image = items.find(function (item) {
        return history_image.id == item.id
      })

      if (typeof feed_image === "undefined") {
        console.log("purge image")
      }
    }
  }
}

const photo_chooser_instance = new PhotoChooserEngine()
const PhotoChooser = () => photo_chooser_instance
