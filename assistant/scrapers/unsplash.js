"use strict";

function receive_message(message){
  if (message.scrape) {
    if (can_scrape()) {
      scrape()
    } else {
      browser.runtime.sendMessage({"cannot": "scrape"})
    }
  }
}

browser.runtime.onMessage.addListener(receive_message)

console.log('unsplash loaded')

function can_scrape(){
  const path_matcher = /^https:\/\/(www\.)?unsplash\.com\/photos\//
  return path_matcher.test(location.href)
}

async function scrape(){
  const path = location.href.split('/')
  const img_id = path[path.length - 1]
  console.log(img_id)
  browser.runtime.sendMessage({ "scrape_results": img_id })
}

scrape()
