async function fetch_image() {
  feed_url = "https://robacarp.github.io/photographic_start/feed.json"
  response = await fetch(feed_url)
  feed = await response.json()
  number = parseInt(Math.random() * 3)
  item = feed.items[number]

  set_image(item.url)
  show_info(item)
}

function set_image(url) {
  document.querySelector('html').style.setProperty("background-image", "url(" + url + ")")
}

function show_info(item) {
  body = document.body
  css_class = item._meta.bezel_color == 'dark' ? 'dark' : 'light'
  body.classList.remove('dark', 'light')
  body.classList.add(css_class)

  bezel = document.querySelector('info')
  bezel.innerHTML = `
    <title>${item.content_text}</title>
    <by-line>
      By <a href="${item.author.url}">${item.author.name}</a>
      on <a href="${item._meta.venue_url}">${item._meta.venue}</a>
    </by-line>
  `
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
  update_clock()
  info_box_toggly()
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

  hour = now.getHours()
  if (! window.config.twentyfour_hour_clock && hour > 12) hour -= 12
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

  document.querySelector('time').innerHTML = time
}

function update_date(now) {
  date = ""

  if (window.config.date_format == "good") {
    sep = "-"
    year = now.getFullYear()
    date += year
    date += sep

    month = now.getMonth()
    month += 1
    date += month
    date += sep

    day = now.getDate()
    date += day
  } else {
    date += lookup_month_conversion(now.getMonth())
    date += " "

    day = now.getDate()
    date += day
    date += ", "

    year = now.getFullYear()
    date += year
  }

  document.querySelector('date').innerHTML = date
}

function lookup_month_conversion(month) {
  switch (month) {
    case 0: return "January"
    case 1: return "February"
    case 2: return "March"
    case 3: return "April"
    case 4: return "May"
    case 5: return "June"
    case 6: return "July"
    case 7: return "August"
    case 8: return "September"
    case 9: return "October"
    case 10: return "November"
    case 11: return "December"
  }
}

async function fetch_config(){
  window.config = await browser.storage.sync.get()
}

fetch_config()
fetch_image()
setInterval(tick, 200)
