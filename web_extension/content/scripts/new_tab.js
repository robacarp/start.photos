'use strict';

import Builder from '../../shared/lib/builder.js'
import Storage from '../../shared/storage_manager.js'
import StartPage from '../../shared/start-page/start-page.js'
import SettingsPage from '../../shared/settings-page/settings-page.js'
import InfoBox from '../../shared/info-box/info-box.js'
import ImageChooser from '../../shared/image_chooser.js'
import Version from '../../shared/version.js'

// Setup the event listener for when local storage is changed
const display_options = Storage.display
const chooser = new ImageChooser()

// Switches between images
async function loadImage(historyOffset) {
  await chooser.sortHistory()
  let historical_image = await chooser.peekHistorical()

  if (historical_image) {
    // start_page.preloadHistory(historical_image)
  }

  start_page.image = info_box.image = await chooser.timeTravel(historyOffset)
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

const info_box = document.querySelector('body').appendChild(Builder.tag('info-box'))
const start_page = document.querySelector('body').appendChild(Builder.tag('start-page'))

chooser.choose().then(image => {
  start_page.waitForReady(()=>{ start_page.image = image })
  info_box.waitForReady(()=>{ info_box.image = image })
})

// Insert the version number
document.querySelector('body').appendChild(
  Builder.tag('version', Version.number)
)

// Add the settings page and controls
const settings = Builder.tag('settings-page')
// settings.classList.add('hidden')
settings.addEventListener('close', () => settings.classList.add('hidden'))
document.querySelector('body').appendChild(settings)

document.querySelector('#gear').addEventListener('click', ()  => {
  document.querySelector('settings-page').classList.toggle('hidden')
})
