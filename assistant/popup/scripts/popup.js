async function scrape_page(){
  tabs = await browser.tabs.query({
    active: true,
    currentWindow: true
  })

  browser.tabs.sendMessage(tabs[0].id, {"scrape" : true})
}

async function receive_message(message) {
  if (message.scrape_results) {
    build_popup(message.scrape_results)
  } else if (message.cannot == "scrape") {
    error_message()
  }
}

async function build_popup(results){
  results = JSON.stringify(results, null, '  ')
  document.querySelector('spinner').style.display = 'none'
  output = document.querySelector('results')
  output.innerHTML = `
    <h1>COPIED!</h1>
  `
  navigator.clipboard.writeText(results)
}

async function error_message(){
  output = document.querySelector('results')
  output.innerHTML = `
    Could not scrape, url mismatch.
  `
}

browser.runtime.onMessage.addListener(receive_message)

scrape_page()
