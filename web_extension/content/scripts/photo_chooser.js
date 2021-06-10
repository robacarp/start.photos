"use strict";

class PhotoChooser {
  constructor (feed, history) {
    this.feed = feed
    this.history = history
  }

  pick () {
    // Pivot the feed of images by matching them up with history items
    // and then grouping by the number of times this browser has seen
    // the image.
    let sorted_images = []

    console.log(`${this.feed.length} total images in feed`)

    for (let feed_image of this.feed) {
      let history_image = this.history.find(history_item => history_item.id == feed_image.id)

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

  static async pick () {
    let options = Options()
    await options.read()

    let raw_feed = PhotoChooser.downloadFeed([options.feed.url, options.feed.legacy_feed_url])

    let items = await raw_feed
        .then(feed => feed.json())
        .then(feed => feed.items)

    let chooser = new PhotoChooser(items, options.photo_history.history)
    let item = await chooser.pick()
    return item
  }

  static async downloadFeed (urls) {
    while (urls.length > 0) {
      let url = urls.shift()

      console.log(`Fetching feed data from ${url}.`)

      let feed_request = fetch(
        url, { redirect: "follow", referrer: "no-referrer", credentials: "omit" }
      )

      let raw_feed
      let success = false

      try {
        raw_feed = await feed_request
        success = true
      } catch (e) { }

      if (success)
        return raw_feed
    }

    throw "Could not find a working feed."
  }
}
