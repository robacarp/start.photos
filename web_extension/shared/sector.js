"use strict";

class Sector {
  constructor() {
    this.fetched = false
  }

  // Overrideable method.
  // Indicates which browser storage sector is used to persist
  // configuration data for the current class.
  get storage_area() {
    return "local"
  }

  // Returns the browser storage namespace for the current class.
  get storage_name() {
    return this.__proto__.constructor.name
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

  // Ensures that the configuration object has been read from
  // browser storage.
  async ensureRead() {
    if (this.fetched)
      return Promise.resolve(true)
    else
      return this.read()
  }

  // Read the configuration object from storage and hydrate object properties.
  async read () {
    console.debug(`Reading ${this.storage_name} from ${this.storage_area}`)
    const stored_options = await browser.storage[this.storage_area].get()

    this.populateWithConfig(stored_options)
    this.fetched = true
    return this
  }

  // Write the configuration object to storage.
  async write () {
    console.debug(`Writing ${this.storage_name} to ${this.storage_area}`)
    return browser.storage[this.storage_area].set(this.writableConfig())
  }
}
