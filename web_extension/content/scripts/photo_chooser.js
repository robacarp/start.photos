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

    for (let feed_image of this.feed) {
      let history_image = this.history.find(history_item => history_item.id == feed_image.id)

      let seen_count = 0
      if (history_image) seen_count = history_image.seen_count

      if (sorted_images[seen_count] === undefined)
        sorted_images[seen_count] = []

      sorted_images[seen_count].push(feed_image)
    }

    // The first slot in the array represents the collection of images which have been
    // viewed the fewest times. Hopefully this is always the first.
    const seen_the_least = sorted_images.find(list => list && list.length > 0)

    // Randomly choose one of the images which has been seen the least.
    const number = parseInt(Math.random() * seen_the_least.length)
    return seen_the_least[number]
  }

  static async pick () {
    let options = new Options()
    await options.read()

    let feed = await fetch(options.feed.url)
      .then(feed => feed.json())
      .then(feed => feed.items)

    let chooser = new PhotoChooser(feed, options.photo_history.history)
    let item = await chooser.pick()
    return item
  }
}
