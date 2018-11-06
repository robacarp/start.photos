"use strict";

class PhotoChooser {
  constructor (feed, history) {
    this.feed = feed
    this.history = history
  }

  pick () {
    let number = parseInt(Math.random() * this.feed.length)
    return this.feed[number]
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
