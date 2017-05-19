const tabs = require("./src/tabs")
const icons = require("./src/icons")
const likes = require("./src/likes")
const login = require("./src/login")
const config = require("./config")

tabs.onUpdated(icons.update)

chrome.browserAction.onClicked.addListener(onClick)
chrome.runtime.onInstalled.addListener(function(details){
  if(details.reason == "install"){
    console.log("This is a first install!");
  }
});

function onClick (tab) {
  login((error, auth) => {
    if (error || !auth) chrome.tabs.create({ url: config.host() + '/login?from=extension&like=' + escape(tab.url) });

    likes.isLiked(tab.url, liked => {
      likes[liked ? "unlike" : "like"](tab.url, err => {
        if (err) return console.error(err)
        icons.set(!liked)
      })
    })
  })
}
