"use strict";

class ImageChooser {
  constructor () {
    this.history_pointer = 0
    this.history_manager = Storage().history_manager
    this.cache = Storage().photo_cache
    this.sorted_history = null
    this.sorted = false

    Feed().ensureFetched()
  }

  async sortHistory () {
    if (this.sorted) return
    this.sorted = true

    await this.history_manager.ensureRead()
    this.sorted_history = this.history_manager.history.sort(
      (a,b) => new Date(a.last_seen_at) - new Date(b.last_seen_at)
    )
  }

  async choose() {
    const cache = Storage().cache
    await cache.ensureRead()
    await cache.topUp()
    let image = cache.pop()

    if (! image) image = await PhotoRandomizer().pick()
    if (! image) return

    const history = Storage().history_manager
    await history.ensureRead()
    history.increment(image)

    return image
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
    if (next_historical_image > this.sorted_history.length) return

    const image_id = this.sorted_history[next_historical_image].id
    const image_object = Feed().find(image_id)
    return image_object
  }

  async historicalImage() {
    const offset = this.sorted_history.length + this.history_pointer - 1
    const image_id = this.sorted_history[offset].id
    const image_object = Feed().find(image_id)
    return image_object
  }

  async futureImage() {
    await this.cache.ensureRead()
    return this.cache.peek(this.history_pointer - 1)
  }
}
