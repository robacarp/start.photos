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

  // Display options are persisted to sync storage for visual consistency
  // across all browsers a user is logged into.
  get storage_area () { return "sync" }
}
