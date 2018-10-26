function default_config(){
  return {
    "show_clock": true,
    "twentyfour_hour_clock": true,
    "show_date": true,
    "date_format": "good",
    "show_info": true,
    "show_seconds": false
  }
}

async function update_form_to_match_storage() {
  check_a_box = (id) => { document.querySelector("#" + id).checked = config[id] }

  config = await browser.storage.sync.get(default_config())

  check_a_box("show_clock")
  check_a_box("twentyfour_hour_clock")
  check_a_box("show_seconds")
  check_a_box("show_date")
  check_a_box("show_info")


  options = document.querySelector('#date_format').options
  for (option of options) {
    option.selected = option.value == config.date_format
  }

  hide_and_show_things()
}

async function update_storage_to_match_form() {
  check_checkbox = (id) => { config[id] = document.querySelector("#" + id).checked }

  config = default_config()

  check_checkbox("show_clock")
  check_checkbox("twentyfour_hour_clock")
  check_checkbox("show_seconds")
  check_checkbox("show_date")
  check_checkbox("show_info")

  config.date_format = document.querySelector('#date_format').value

  await browser.storage.sync.set(config)
}

function hide_and_show_things() {
  hide_if_checked = (checkbox, toggled_control) => {
    visible = document.querySelector(checkbox).checked
    document.querySelector(toggled_control).style.display = visible ? "" : "none"
  }

  hide_if_checked('#show_clock','.hide_unless_clock')
  hide_if_checked('#show_date','.hide_unless_date')
}

function something_changed() {
  update_storage_to_match_form()
  hide_and_show_things()
}

async function attach() {
  update_form_to_match_storage()

  document.querySelectorAll("input,select").forEach(
    function(input) {
      input.onchange = something_changed
    }
  )
}

async function read_storage(){
  current_storage = await browser.storage.sync.get()
  console.log("current storage: ", current_storage)
}

update_form_to_match_storage()
attach()
