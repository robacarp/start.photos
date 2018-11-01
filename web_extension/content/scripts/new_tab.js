async function fetch_image() {
  feed_url = "https://robacarp.github.io/photographic_start/feed.json"
  response = await fetch(feed_url)
  feed = await response.json()
  number = parseInt(Math.random() * feed.items.length)
  item = feed.items[number]

  set_image(item.url)
  show_info(item)
}

function set_image(url) {
  document.querySelector('background').style.setProperty("background-image", "url(" + url + ")")
}

function show_info(item) {
  document.querySelector('info name').appendChild( link(item.external_url, item.content_text) )
  document.querySelector('info by-line').appendChild( link(item.author.url, item.author.name) )
  document.querySelector('info venue').appendChild( link(item._meta.venue.url, item._meta.venue.name) )

  if (item._meta.camera_settings.f)
    document.querySelector('info camera').appendChild(tag('aperture', item._meta.camera_settings.f))

  if (item._meta.camera_settings.iso)
    document.querySelector('info camera').appendChild(tag('iso', item._meta.camera_settings.iso))

  if (item._meta.camera_settings.shutter_speed)
    document.querySelector('info camera').appendChild(tag('shutter', item._meta.camera_settings.shutter_speed))
}

function info_box_toggly(){
  if (window.config.show_info) {
    document.querySelector('info').style.display = ""
  } else {
    document.querySelector('info').style.display = "none"
  }
}

function tick() {
  fetch_config()
  set_bezel_persistence()
  update_clock()
  info_box_toggly()
}

async function set_bezel_persistence(){
  document.querySelector('clock').classList.remove('subtle', 'aggressive', 'demanding')
  document.querySelector('info').classList.remove('subtle', 'aggressive', 'demanding')

  document.querySelector('clock').classList.add(window.config.clock_persistence.toLowerCase())
  document.querySelector('info').classList.add(window.config.info_persistence.toLowerCase())
}


async function update_clock(){
  now = new Date()
  update_time(now)
  update_date(now)

  if (window.config.show_clock) {
    document.querySelector('time').style.display = ""
  } else {
    document.querySelector('time').style.display = "none"
  }

  if (window.config.show_date) {
    document.querySelector('date').style.display = ""
  } else {
    document.querySelector('date').style.display = "none"
  }

  if (window.config.show_clock && window.config.show_date) {
    document.querySelector('clock').classList.add('top_border')
  } else {
    document.querySelector('clock').classList.remove('top_border')
  }

  if (window.config.show_clock || window.config.show_date) {
    document.querySelector('clock').style.display = ""
  } else {
    document.querySelector('clock').style.display = "none"
  }
}

function update_time(now) {
  time = ""
  sep = ":"

  if (window.config.clock_flash && now.getSeconds() % 2 == 0)
    sep = " "

  hour = now.getHours()
  if (window.config.twentyfour_hour_clock) {
    if (hour < 10) hour = "0" + hour
  } else {
    if (hour > 12) hour -= 12
  }
  time += hour
  time += sep

  minute = now.getMinutes()
  if (minute < 10) minute = "0" + minute
  time += minute

  if (window.config.show_seconds) {
    second = now.getSeconds()
    if (second < 10) second = "0" + second
    time += sep
    time += second
  }

  document.querySelector('time').textContent = time
}

function update_date(now) {
  let date = ""

  if (window.config.date_format == "good") {
    date = terse_date(now)
  } else {
    date = verbose_date(now)
  }

  document.querySelector('date').textContent = date
}

async function fetch_config(){
  window.config = await browser.storage.sync.get(default_options())
}

fetch_config()
fetch_image()
setInterval(tick, 100)
