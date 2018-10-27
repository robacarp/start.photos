console.log('500px loaded')
browser.runtime.onMessage.addListener(pageActionNotification)

function pageActionNotification(message){
  if (message.scrape) {
    scrape()
  }
}

function scrape(){
  img_element = document.querySelector('img.photo')
  title = document.querySelector('.description h2')
  author = document.querySelector('.attribution_region .photographer_info a.actor')
  avatar = document.querySelector('img.user_avatar__avatar_image')

  tags = []
  document.querySelectorAll('.tag-container span').forEach((t) => { tags.push(t.innerText) })

  contents = {
    "url": img_element.src,
    "content_text": title.innerHTML,
    "_meta": {
      "venue": "500px",
      "venue_url": "https://500px.com",
      "bezel_color": "light"
    },

    "author": {
      "name": author.innerText,
      "url": author.href,
      "avatar": avatar.src
    },

    "tags": tags
  }

  console.log(contents)
}
