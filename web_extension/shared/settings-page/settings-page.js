"use strict";

import BaseComponent from '../lib/base-component.js'
import Storage from '../../shared/storage_manager.js'

export default class SettingsPage extends BaseComponent {
  constructor() {
    super()
    this.attachCSS('../shared/settings-page/settings-page.css')
    this.attachHTML('../shared/settings-page/settings-page.html')
  }

  readyCallback () {
    this.read()

    const inputEvent = (event) => {
      this.write()
      this.hideAndShowThings()
    }

    for (let input of this.shadowRoot.querySelectorAll("input,select")) {
      input.addEventListener('change', inputEvent)
    }
  }

  hideAndShowThings() {
    const hideIfChecked = async (checkboxes, toggled_control) => {
      let visible = false
      checkboxes = [].concat(checkboxes)

      for (let box_id of checkboxes)
        visible = visible || this.shadowRoot.querySelector(box_id).checked

      for (let element of this.shadowRoot.querySelectorAll(toggled_control))
        element.style.display = visible ? "" : "none"
    }

    hideIfChecked('#show_clock',  '.hide_unless_clock')
    hideIfChecked('#show_date',   '.hide_unless_date')
    hideIfChecked('#custom_feed', '.hide_unless_custom_feed')
  }

  fillDateFormats() {
    const date_format = this.shadowRoot.querySelector("#date_format")
    date_format.querySelectorAll('option').forEach(o => o.remove())

    let today = new Date()
    date_format.appendChild(Builder.option(terse_date(today), "good"))
    date_format.appendChild(Builder.option(verbose_date(today), "bad"))
  }

  get checks () {
    return this.shadowRoot.querySelectorAll('input[type=checkbox]')
  }

  get selects () {
    return this.shadowRoot.querySelectorAll('select')
  }

  get texts () {
    return this.shadowRoot.querySelectorAll('input[type=text]')
  }

  async read () {
    await Storage.ensureRead()

    for (let check_box of this.checks)
      if (check_box.dataset.namespace) {
        check_box.checked = Storage[check_box.dataset.namespace][check_box.id]
    }

    for (let select_box of this.selects)
      if (select_box.dataset.namespace)
        for (let option of select_box.options)
          option.selected = (
            option.value == Storage[select_box.dataset.namespace][select_box.id]
          )

    for (let text_box of this.texts)
      text_box.value = Storage[text_box.dataset.namespace][text_box.id]
  }

  async write () {
    for (let check_box of this.checks)
      if (check_box.dataset.namespace)
        Storage[check_box.dataset.namespace][check_box.id] = check_box.checked

    for (let select_box of this.selects)
      if (select_box.dataset.namespace)
        Storage[select_box.dataset.namespace][select_box.id] = select_box.value

    for (let text_box of this.texts)
      Storage[text_box.dataset.namespace][text_box.id] = text_box.value

    return Promise.all([Storage.display.write(), Storage.feed.write()])
  }
}

customElements.define('settings-page', SettingsPage)

