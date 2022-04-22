"use strict";

import Sector from '../lib/sector.js'

export default class PhotoHistory extends Sector {
  constructor () {
    super()
    this.history = []
  }

  get storedProperties() {
    return new Set(["history"])
  }

  increment (photo) {
    if (! this.fetched) throw "history increment before fetch"

    const history_item = this.history.find(item => photo.id == item.id)
    const now = (new Date()).toJSON()

    if (history_item) {
      history_item.seen_count += 1
      history_item.last_seen_at = now
    } else {
      this.history.push({
        "id" : photo.id,
        "last_seen_at" : now,
        "seen_count" : 1
      })
    }

    this.write()
  }
}
