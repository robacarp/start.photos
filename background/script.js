browser.pageAction.onClicked.addListener(addressButtonClicked);

async function addressButtonClicked(){
  tabs = await browser.tabs.query({
    active: true,
    currentWindow: true
  })

  browser.tabs.sendMessage(tabs[0].id, {"scrape" : true})
}
