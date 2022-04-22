'use strict';

import Storage from '../../shared/storage_manager.js'
import ImageChooser from '../../shared/image_chooser.js'
import StartPage from '../../shared/start_page.js'
import Version from '../../shared/version.js'

// Setup the event listener for when local storage is changed
const display_options = Storage.display
let option_read_timeout = 0

browser.storage.onChanged.addListener(() => {
  clearTimeout(option_read_timeout)
  option_read_timeout = setTimeout(() => display_options.read(), 150)
})

const chooser = new ImageChooser()
const start_page = new StartPage()

async function loadImage(historyOffset) {
  await chooser.sortHistory()
  let historical_image = await chooser.peekHistorical()

  if (historical_image) {
    start_page.preloadHistory(historical_image)
  }

  const previousImage = await chooser.timeTravel(historyOffset)

  start_page.set(previousImage)
}

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

document.addEventListener('DOMContentLoaded', async () => {
  start_page.setup();
  document.querySelector('version').textContent = Version.number
  let current_image = await chooser.choose()
  start_page.set(current_image)
  setInterval(() => start_page.tick(), 100)
});
