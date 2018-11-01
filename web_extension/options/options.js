async function update_form_to_match_storage() {
  config = await browser.storage.sync.get(default_options())

  check_a_box = (id) => { document.querySelector("#" + id).checked = config[id] }

  select_the_option = (id) => {
    options = document.querySelector('#' + id).options
    for (option of options) {
      option.selected = option.value == config[id]
    }
  }

  check_a_box("show_clock")
  check_a_box("twentyfour_hour_clock")
  check_a_box("show_seconds")
  check_a_box("show_date")
  check_a_box("show_info")

  select_the_option('date_format')
  select_the_option('clock_persistence')
  select_the_option('info_persistence')

  hide_and_show_things()
}

async function update_storage_to_match_form() {
  check_checkbox = (id) => { config[id] = document.querySelector("#" + id).checked }
  option_be_select = (id) => { config[id] = document.querySelector("#" + id).value }

  config = default_options()

  check_checkbox("show_clock")
  check_checkbox("twentyfour_hour_clock")
  check_checkbox("show_seconds")
  check_checkbox("show_date")
  check_checkbox("show_info")

  option_be_select('date_format')
  option_be_select('clock_persistence')
  option_be_select('info_persistence')

  await browser.storage.sync.set(config)
}

function hide_and_show_things() {
  hide_if_checked = (checkboxes, toggled_control) => {
    visible = false
    checkboxes = [].concat(checkboxes)
    checkboxes.forEach(function(box_id) {
      visible = visible || document.querySelector(box_id).checked
    })

    document.querySelectorAll(toggled_control).forEach(function(element) {
      element.style.display = visible ? "" : "none"
    })
  }

  hide_if_checked('#show_clock','.hide_unless_clock')
  hide_if_checked('#show_date','.hide_unless_date')
}

function something_changed() {
  update_storage_to_match_form()
  hide_and_show_things()
}

function set_format_dates() {
  date_format = document.querySelector("#date_format")
  date_format.querySelectorAll('option').forEach(o => o.remove())

  today = new Date()
  date_format.appendChild(option(terse_date(today), "good"))
  date_format.appendChild(option(verbose_date(today), "bad"))
}

async function attach() {
  set_format_dates()
  update_form_to_match_storage()

  document.querySelectorAll("input,select").forEach(
    function(input) {
      input.onchange = something_changed
    }
  )
}

async function read_storage(){
  current_storage = await browser.storage.sync.get()
}

attach()
