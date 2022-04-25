'use strict';

import Builder from '../../shared/lib/builder.js'
import Storage from '../../shared/storage_manager.js'
import StartPage from '../../shared/start-page/start-page.js'
import SettingsPage from '../../shared/settings_page/index.js'
import InfoBox from '../../shared/info-box/info-box.js'

// Setup the event listener for when local storage is changed
const display_options = Storage.display
let option_read_timeout = 0

browser.storage.onChanged.addListener(() => {
  clearTimeout(option_read_timeout)
  option_read_timeout = setTimeout(() => display_options.read(), 150)
})

// Switches between images
async function loadImage(historyOffset) {
  await chooser.sortHistory()
  let historical_image = await chooser.peekHistorical()

  if (historical_image) {
    // start_page.preloadHistory(historical_image)
  }

  const previousImage = await chooser.timeTravel(historyOffset)

  // start_page.set(previousImage)
}

// Listens for keypresses
document.addEventListener('keydown',
  async function (e) {
    switch (e.code) {
      case "ArrowRight":
        loadImage(1)
        break
      case "ArrowLeft":
        loadImage(-1)
        break;
    }
  }
);

// Load the image display and sidebar bezel
// setInterval(() => start_page.tick(), 100)


const info_box = document.querySelector('body').appendChild(Builder.tag('info-box'))
const start_page = Builder.tag('start-page')
start_page.addEventListener('image-changed', (e) => {
  // todo
  info_box.update(e.detail)
})

document.querySelector('body').appendChild(start_page)

// document.querySelector('body').appendChild(
//   Builder.tag('settings-page')
// )

//   document.querySelector(selector).innerHTML = `<version>${Version.number}</version>`

document.querySelector('#gear').addEventListener('click', ()  => {
  document.querySelector('#settings-page').classList.toggle('hidden')
})
