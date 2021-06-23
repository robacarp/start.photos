'use strict';

class OptionsSynchronizer {
  constructor () {
    this.options = new StorageManager()
  }

  get checks () {
    return document.querySelector('#photographic_options')
                   .querySelectorAll('input[type=checkbox]')
  }

  get selects () {
    return document.querySelector('#photographic_options')
                   .querySelectorAll('select')
  }

  get texts () {
    return document.querySelector('#photographic_options')
                   .querySelectorAll('input[type=text]')
  }

  async read () {
    await this.options.read()

    for (let check_box of this.checks)
      if (check_box.dataset.namespace)
        check_box.checked = this.options[check_box.dataset.namespace][check_box.id]

    for (let select_box of this.selects)
      if (select_box.dataset.namespace)
        for (let option of select_box.options)
          option.selected = (
            option.value == this.options[select_box.dataset.namespace][select_box.id]
          )

    for (let text_box of this.texts)
      text_box.value = this.options[text_box.dataset.namespace][text_box.id]
  }

  async write () {
    for (let check_box of this.checks)
      if (check_box.dataset.namespace)
        this.options[check_box.dataset.namespace][check_box.id] = check_box.checked

    for (let select_box of this.selects)
      if (select_box.dataset.namespace)
        this.options[select_box.dataset.namespace][select_box.id] = select_box.value

    for (let text_box of this.texts)
      this.options[text_box.dataset.namespace][text_box.id] = text_box.value

    return Promise.all([this.options.display.write(), this.options.feed.write()])
  }
}

function hideAndShowThings () {
  const hideIfChecked = async (checkboxes, toggled_control) => {
    let visible = false
    checkboxes = [].concat(checkboxes)

    for (let box_id of checkboxes)
      visible = visible || document.querySelector(box_id).checked

    for (let element of document.querySelectorAll(toggled_control))
      element.style.display = visible ? "" : "none"
  }

  hideIfChecked('#show_clock',  '.hide_unless_clock')
  hideIfChecked('#show_date',   '.hide_unless_date')
  hideIfChecked('#custom_feed', '.hide_unless_custom_feed')
}

function fillDateFormats() {
  const date_format = document.querySelector("#date_format")
  date_format.querySelectorAll('option').forEach(o => o.remove())

  let today = new Date()
  date_format.appendChild(Builder.option(terse_date(today), "good"))
  date_format.appendChild(Builder.option(verbose_date(today), "bad"))
}

function attach() {
  for (let input of document.querySelectorAll("input,select")) {
    input.onchange = function(){
      options_synchronizer.write()
      hideAndShowThings()
    }
  }
}

const options_synchronizer = new OptionsSynchronizer()
options_synchronizer.read().then( function() {
  fillDateFormats()
  hideAndShowThings()
  document.querySelector('#photographic_options').style.display = ''
  attach()
}).catch( function(e) {
  console.log(e)
})
