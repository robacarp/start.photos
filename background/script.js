//     'jQuery(this).attr("href", "omnifocus:///add?name="+encodeURIComponent(projectName+" - "+title)+"&note="+encodeURIComponent("https://www.pivotaltracker.com/story/show/"+id));'+
//     'return true;'+
//     '\'>&#x2713; Send to OmniFocus</a></div><%= sectionA %>');

browser.pageAction.onClicked.addListener(addressButtonClicked);

function addressButtonClicked(){
  browser.tabs.sendMessage({"string" : "ohio"})
}
