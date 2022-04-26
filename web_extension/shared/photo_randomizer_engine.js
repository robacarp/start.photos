"use strict";

import Storage from './storage_manager.js'
import Feed from './photo_feed.js'

class PhotoRandomizerEngine {
  constructor () { }

  async pick () {
    // Pivot the feed of images by matching them up with history items
    // and then grouping by the number of times this browser has seen
    // the image.
    let sorted_images = []
    await Feed.ensureFetched()

    for (let feed_image of Feed.images) {
      let history_image = Storage.history_manager.history.find(history_item => history_item.id == feed_image.id)

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

    console.info(`${Feed.images.length} images in feed. Choosing from ${seen_the_least.length} images which have been seen the least.`)

    // Randomly choose one of the images which has been seen the least.
    const number = parseInt(Math.random() * seen_the_least.length)
    return seen_the_least[number]
  }
}

const photo_randomizer_instance = new PhotoRandomizerEngine()

export default () => photo_randomizer_instance
