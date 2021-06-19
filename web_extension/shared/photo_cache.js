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

  pop () {
    let item = this.items[0]
    const now = (new Date()).getTime()

    if (now - this.last_new_image > this.computed_refresh_interval) {
      this.items.shift()
      item = this.items[0]
      this.last_new_image = now
    }

    this.write()
    return item
  }

  peek (at) {
    this.topUp(at + 2)
    return this.items[at]
  }

  async topUp(depth = this.depth) {
    await this.ensureRead()

    const cache_depletion = depth - this.count
    if (cache_depletion > 0) console.info(`Cache is depleted by ${cache_depletion}`)

    for (let i = cache_depletion; i > 0; i --) {
      let item = await PhotoRandomizer().pick()

      if (! item) continue

      let img = Builder.img(item.url)
      console.info(`Fetching ${item.url}`)

      document.querySelector('prefetch').appendChild(img)

      img.onload = () => {
        console.info(`Finished caching ${item.url}`)
        this.push(item)
      }
    }
  }
}
