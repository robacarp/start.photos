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

  // Overrideable method.
  // Returns a list of properties which should be persisted when
  // the config object is written to browser storage.
  configProperties() {
    return Object.getOwnPropertyNames(this)
  }

  // Creates the formatted object for writing to browser storage
  writableConfig() {
    let config = {}
    for (let field of this.configProperties())
      config[field] = this[field]

    delete config.fetched

    const writable = {}
    writable[this.storage_name] = config
    return writable
  }

  // Overrideable method.
  // Hydrates an object from local storage.
  populateWithConfig(config) {
    for (let field of this.configProperties())
      if (config[this.storage_name] && typeof config[this.storage_name][field] !== undefined)
        this[field] = config[this.storage_name][field]
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
