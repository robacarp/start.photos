function default_options(){
  return {
    "show_clock": true,
    "twentyfour_hour_clock": true,
    "show_seconds": false,
    "clock_persistence": "Subtle",
    "info_persistence": "Subtle",
    "clock_flash": false,
    "show_date": true,
    "date_format": "good",
    "show_info": true
  }
}

async function nuke_storage(){
  options = await browser.storage.sync.get(default_options())
  console.log("options were: ", options)
  await browser.storage.sync.clear()
}
