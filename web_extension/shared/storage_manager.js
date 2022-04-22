"use strict";

import DisplayOptions from './storage/display_options.js'
import FeedOptions from './storage/feed_options.js'
import PhotoHistory from './storage/photo_history.js'
import PhotoCache from './storage/photo_cache.js'

export class StorageManager {
  constructor() {
    this.version = 1
    this.display_options = (new DisplayOptions())
    this.photo_history = (new PhotoHistory())
    this.feed_options = (new FeedOptions())
    this.photo_cache = (new PhotoCache())
  }

  read() {
    Promise.all([
      this.display.read(),
      this.history_manager.read(),
      this.feed.read(),
      this.cache.read()
    ])
  }

  get display() { return this.display_options }
  get history_manager() { return this.photo_history }
  get feed()    { return this.feed_options }
  get cache()   { return this.photo_cache }
}

export default new StorageManager()
