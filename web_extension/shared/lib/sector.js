"use strict";

export default class Sector {
  constructor() {
    this.fetched = false
    this.fetchingPromise = null
  }

  // Overrideable method.
  // Indicates which browser storage sector is used to persist
  // configuration data for the current class.
  get storage_area() {
    return "local"
  }

  // Returns the browser storage namespace for the current class.
  get storage_name() {
    return Object.getPrototypeOf(this).constructor.name
  }

  // Abstract method.
  // Returns a Set of property names which can be persisted.
  get storedProperties() {
    return new Set()
  }

  // Creates the formatted object for writing to browser storage
  writableConfig() {
    let config = {}
    for (let field of this.storedProperties)
      config[field] = this[field]

    const writable = {}
    writable[this.storage_name] = config
    return writable
  }

  // Overrideable method.
  // Hydrates an object from local storage.
  populateWithConfig(config) {
    const storage_name = this.storage_name

    for (let field of this.storedProperties)
      if (config[storage_name] && config[storage_name][field] !== undefined)
        this[field] = config[storage_name][field]
  }

  // Ensures that the configuration object has been read from browser storage.
  async ensureRead() {
    if (this.fetched)
      return true

    if (this.fetchingPromise)
      return this.fetchingPromise

    this.fetchingPromise = this.read()
    return this.fetchingPromise
  }

  // Read the configuration object from storage and hydrate object properties.
  async /* private */ read () {
    const stored_options = await browser.storage[this.storage_area].get()

    this.populateWithConfig(stored_options)
    this.fetched = true
    return this
  }

  // Write the configuration object to storage.
  async write () {
    return browser.storage[this.storage_area].set(this.writableConfig())
  }
}
