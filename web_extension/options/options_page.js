'use strict';

class OptionsSynchronizer {
  constructor () {
    this.options = new Options()
  }

  get checks () {
    return document.querySelector('#photographic_options')
                   .querySelectorAll('input[type=checkbox]')
  }

  get selects () {
    return document.querySelector('#photographic_options')
                   .querySelectorAll('select')
  }

  async read () {
    let that = this
    return this.options.read().then(function(){
      for (let check_box of that.checks)
        check_box.checked = that.options[check_box.dataset.namespace][check_box.id]

      for (let select_box of that.selects)
        for (let option of select_box.options)
          option.selected = (
            option.value == that.options[select_box.dataset.namespace][select_box.id]
          )
    })
  }

  async write () {
    for (let check_box of this.checks)
      this.options[check_box.dataset.namespace][check_box.id] = check_box.checked

    for (let select_box of this.selects)
      this.options[select_box.dataset.namespace][select_box.id] = select_box.value

    return this.options.write()
  }
}

async function hideAndShowThings () {
  let hideIfChecked = (checkboxes, toggled_control) => {
    let visible = false
    checkboxes = [].concat(checkboxes)
    checkboxes.forEach(function(box_id) {
      visible = visible || document.querySelector(box_id).checked
    })

    document.querySelectorAll(toggled_control).forEach(function(element) {
      element.style.display = visible ? "" : "none"
    })
  }

  hideIfChecked('#show_clock','.hide_unless_clock')
  hideIfChecked('#show_date','.hide_unless_date')
}

function fillDateFormats() {
  date_format = document.querySelector("#date_format")
  date_format.querySelectorAll('option').forEach(o => o.remove())

  let today = new Date()
  date_format.appendChild(Builder.option(terse_date(today), "good"))
  date_format.appendChild(Builder.option(verbose_date(today), "bad"))
}

async function attach() {
  document.querySelectorAll("input,select").forEach( function(input) {
    input.onchange = function(){
      options_synchronizer.write()
      hideAndShowThings()
    }
  })
}

async function read_storage(){
  current_storage = await browser.storage.sync.get()
}

const options_synchronizer = new OptionsSynchronizer()
options_synchronizer.read().then( function() {
  fillDateFormats()
  hideAndShowThings()
  attach()
}).catch( function(e) {
  console.log(e)
})
