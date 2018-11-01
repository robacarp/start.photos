function receive_message(message){
  if (message.scrape) {
    if (can_scrape()) {
      scrape()
    } else {
      browser.runtime.sendMessage({ "cannot": "scrape" })
    }
  }
}

browser.runtime.onMessage.addListener(receive_message)

console.log('500px loaded')

function can_scrape(){
  path_matcher = /^https:\/\/(www\.)?500px\.com\/photo\//
  return path_matcher.test(location.href)
}

// Thanks, stackoverflow user broofa
// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#2117523
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

function scrape(){
  img_element = document.querySelector('img.photo')
  author = document.querySelector('.attribution_region .photographer_info a.actor')
  avatar = document.querySelector('img.user_avatar__avatar_image')
  author_url = author.href.substring( 0, author.href.indexOf('?') )

  title = document.querySelector('.description h2')
  if (! title) {
    title = "Untitled"
  } else {
    title = title.innerText
  }

  camera_settings = document.querySelector('.camera_settings').innerHTML.split('<div class="separator">/</div>')
  aperture = camera_settings[1]
  shutter_speed = camera_settings[2]
  iso = camera_settings[3]

  tags = []
  document.querySelectorAll('.tag-container span').forEach((t) => { tags.push(t.innerText.trim().toLowerCase()) })

  // remove the 500px internal tracking "from=popular" etc
  url = location.origin + location.pathname

  contents = {
    "id": uuidv4(),
    "url": img_element.src,
    "external_url": url,
    "content_text": title,

    "_meta": {
      "venue": {
        "name": "500px",
        "url": "https://500px.com"
      },
      "bezel_color": "light",
      "camera_settings": {
        "iso": iso,
        "shutter_speed": shutter_speed,
        "f": aperture
      }
    },

    "author": {
      "name": author.innerText,
      "url": author_url,
      "avatar": avatar.src
    },

    "tags": tags
  }

  browser.runtime.sendMessage({ "scrape_results": contents })
}
