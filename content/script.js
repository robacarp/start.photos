async function fetch_image() {
  feed_url = "https://robacarp.github.io/photographic_start/feed.json"
  response = await fetch(feed_url)
  feed = await response.json()
  number = Math.random() * 100 > 50 ? 1 : 0
  item = feed.items[number]

  set_image(item.url)
  show_info(item)
}

function set_image(url) {
  document.querySelector('html').style.setProperty("background-image", "url(" + url + ")")
}

function show_info(item) {
  css_class = item._meta.bezel_color == 'dark' ? 'dark' : 'light'

  document.body.innerHTML = `
  <bezel class="${css_class}">
    <avatar>
      <img src="${item.author.avatar}">
    </avatar>
    <info>
      <title>${item.content_text}</title>
      <by-line>
        By <a href="${item.author.url}">${item.author.name}</a>
        on <a href="${item._meta.venue}">${item._meta.venue}</a>
      </by-line>
    </info>
  </info>
  `
}

fetch_image()
