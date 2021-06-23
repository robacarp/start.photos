// Tracks photos which should have been cached by the browser, and when
// a new image should be shown instead of the same image as last time.
//
// The browser handles the actual caching of image data and the image ID
// is added to the cache manifest so it can be fetched quickly at the next
// new-tab.
class PhotoCache extends Sector {
  constructor (options) {
    super(options)
    this.items = []
    this.last_new_image = 0 // "early" epoch timestamp
    this.refresh_interval = "5s"
    this.depth = 3
  }

  get computed_refresh_interval() {
    switch (this.refresh_interval) {
      case "5s": return 5000
      case "1m": return 60000
      case "1h": return 3600000
      case "1d": return 86400000
    }
  }

  get count () { return this.items.length }

  push (photo) {
    const already_exists = this.items.findIndex(cached => cached.id == photo.id)

    if (already_exists != -1)
      return

    photo.cached_at = (new Date()).toJSON()

    this.items.push(photo)
    this.write()
  }

  // Returns the oldest tracked cache item.
  // If the refresh interval has elapsed then the oldest item is
  // discarded and the next is returned.
  pop () {
    let item = this.items[0]
    const now = (new Date()).getTime()

    if (now - this.last_new_image > this.computed_refresh_interval) {
      this.items.shift()
      item = this.items[0]
      this.last_new_image = now
      this.write()
    }

    return item
  }

  // Returns the cache item at a given location.
  // Pre-loads photos two items ahead. The assumption is that
  // peeking once means peeking at least a few times.
  peek (at) {
    this.topUp(at + 2)
    return this.items[at]
  }

  // Tops up the cache to a given depth by fetching an image
  // from the randomizer and adding it to the DOM.
  async topUp(depth = this.depth) {
    await this.ensureRead()

    const cache_depletion = depth - this.count
    if (cache_depletion > 0) console.info(`Cache is depleted by ${cache_depletion}`)

    for (let i = cache_depletion; i > 0; i --) {
      let item = await PhotoRandomizer().pick()

      if (! item) continue

      let img = Builder.img(item)
      console.info(`Fetching ${item.url}`)

      document.querySelector('prefetch').appendChild(img)

      img.onload = () => {
        console.info(`Finished caching ${item.url}`)
        this.push(item)
      }
    }
  }
}
