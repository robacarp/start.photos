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

function update_clock(){
  now = new Date()
  time = ""
  sep = ":"

  hour = now.getHours()
  if (hour > 12) hour -= 12
  time += hour
  time += sep

  minute = now.getMinutes()
  if (minute < 10) minute = "0" + minute
  time += minute
  time += sep

  second = now.getSeconds()
  if (second < 10) second = "0" + second
  time += second

  document.querySelector('time').innerHTML = time

  date = ""
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

  document.querySelector('date').innerHTML = date
}

fetch_image()
setInterval(update_clock, 200)
