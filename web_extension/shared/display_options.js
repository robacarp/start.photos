class DisplayOptions extends Sector {
  constructor() {
    super()
    this.show_clock = true
    this.show_date = true
    this.show_seconds = false
    this.show_info = true

    this.twentyfour_hour_clock = true
    this.info_persistence = "Subtle"
    this.clock_flash = false
    this.date_format = "good"
  }

  get storedProperties() {
    return new Set([
      "show_clock",
      "show_date",
      "show_seconds",
      "show_info",

      "twentyfour_hour_clock",
      "info_persistence",
      "clock_flash",
      "date_format"
    ])
  }

  // Display options are persisted to sync storage for visual consistency
  // across all browsers a user is logged into.
  get storage_area () { return "sync" }
}
