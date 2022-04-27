"use strict";

export default class Sector {
  constructor() {
    this.fetched = false
    this.fetchingPromise = null
    this.storageChangedCallbacks = []
    this.recentlyWritten = false
    this.recentlyWrittenTimeout = null

    // Debounce-listen for changes to the storage area. Take care to hold and pass on the
    // storage keys which have changed.
    this.browserStorageChangeDebounceTimeout = 0
    this.changed_keys = []
    browser.storage.onChanged.addListener(this.browserStorageChangeEvent.bind(this))
  }

  // Register a callback to be executed when the data source changes externally
  onStorageChanged(callback) {
    this.storageChangedCallbacks.push(callback)
  }

  /* private */ fireChangedCallbacks(){
    this.storageChangedCallbacks.forEach((callback) => callback())
  }

  /* Aggregates multiple browserStorageChangeEvents which occur during a 100ms
   * period into a single event. If this storage sector has recently written,
   * the event is discarded. The list of named keys which have changed is
   * accumulated and sent to the final event listener.
   */
  /* private */ browserStorageChangeEvent(changes) {
       clearTimeout(this.browserStorageChangeDebounceTimeout)

      if (this.recentlyWritten) return true

      this.changed_keys = [...this.changed_keys, ...Object.keys(changes)]

      this.browserStorageChangeDebounceTimeout = setTimeout(() => {
        this.debouncedBrowserStoragedChangedEvent(this.changed_keys)
        this.changed_keys = []
      }, 100)
   }

  /* Called once per series of multiple browserStorageChangeEvents.
  /* private */ debouncedBrowserStoragedChangedEvent(changedStorageAreas) {
    changedStorageAreas.forEach((changedArea) => {
      if (changedArea == this.storage_name) {
        this.read().then(() => this.fireChangedCallbacks())
      }
    })
  }

  /* Overrideable method. Indicates which browser storage sector is used to
   * persist configuration data for the current class.
   */
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
    // set a lock to ignore the "storage changed" event for a short time after
    // writing data to this storage sector.
    this.recentlyWritten = true
    clearTimeout(this.recentlyWrittenTimeout)
    this.recentlyWrittenTimeout = setTimeout(() => {
      this.recentlyWritten = false
    }, 100)

    return browser.storage[this.storage_area].set(this.writableConfig())
  }
}
