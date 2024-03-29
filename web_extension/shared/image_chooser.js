"use strict";

import Storage from './storage_manager.js'
import Feed from './photo_feed.js'
import PhotoRandomizer from './photo_randomizer_engine.js'

export default class ImageChooser {
  constructor () {
    this.history_pointer = 0
    this.history_manager = Storage.history_manager
    this.cache = Storage.photo_cache
    this.sorted_history = null
    this.sorted = false

    Feed.ensureFetched()
  }

  async sortHistory () {
    if (this.sorted) return
    this.sorted = true

    await this.history_manager.ensureRead()
    this.sorted_history = this.history_manager.history.sort(
      (a,b) => new Date(a.last_seen_at) - new Date(b.last_seen_at)
    )
  }

  // Fetches an image, tracks the view count, and tops up the cache.
  async choose() {
    const cache = Storage.cache
    await cache.ensureRead()
    const image = await this.getNext()

    this.cache.topUp()
    if (image) {
      this.incrementHistory(image)
    }

    return image
  }

  // Fetch an image from the cache, and fall back to asking the
  // randomizer to pick one if nothing has been cached.
  async /*private*/ getNext() {
    let image = this.cache.pop()
    if (! image) image = await PhotoRandomizer().pick()
    return image
  }

  // Increments the view count on an image.
  async /*private*/ incrementHistory(image) {
    const history = Storage.history_manager
    await history.ensureRead()
    history.increment(image)
  }

  timeTravel(increment) {
    if (
      increment > 0 && this.history_pointer < 0
      || increment < 0 && this.history_pointer * -1 < this.sorted_history.length - 1
    )
      this.history_pointer += increment

    // Only traveling back in time for now...
    if (this.history_pointer <= 0)
      return this.historicalImage()
    // else (this.history_pointer > 0)
    //   return this.futureImage()
  }

  peekHistorical() {
    const next_historical_image = this.sorted_history.length + this.history_pointer - 2
    if (next_historical_image > this.sorted_history.length || next_historical_image < 0) return

    const image_id = this.sorted_history[next_historical_image].id
    const image_object = Feed.find(image_id)
    return image_object
  }

  historicalImage() {
    const offset = this.sorted_history.length + this.history_pointer - 1
    const image_id = this.sorted_history[offset].id
    const image_object = Feed.find(image_id)
    return image_object
  }

  async futureImage() {
    await this.cache.ensureRead()
    return this.cache.peek(this.history_pointer - 1)
  }
}
