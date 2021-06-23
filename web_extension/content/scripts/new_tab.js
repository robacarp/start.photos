'use strict';

// Setup the event listener for when local storage is changed
const display_options = Storage().display
let option_read_timeout = 0

browser.storage.onChanged.addListener((changes, area) => {
  clearTimeout(option_read_timeout)
  option_read_timeout = setTimeout(() => display_options.read(), 150)
})

const chooser = new ImageChooser()
const viewer = new ImageViewer()

async function loadImage(historyOffset) {
  await chooser.sortHistory()
  let historical_image
  if (historical_image = await chooser.peekHistorical()) {
    viewer.preloadHistory(historical_image)
  }

  const previousImage = await chooser.timeTravel(historyOffset)

  viewer.set(previousImage)
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

document.addEventListener('DOMContentLoaded', async (event) => {
  document.querySelector('version').textContent = Version.number
  let current_image = await chooser.choose()
  viewer.set(current_image)
  setInterval(() => viewer.tick(), 100)
});
