const likes = require("../lib/likes")
const config = require("../config")
const icons = require("./icons")
const user = require("./user")
const tabs = require("./tabs")

icons.listenForChanges()
chrome.browserAction.onClicked.addListener(onClick)

function onClick (tab) {
  user.auth(error => {
    if (error) {
      return tabs.create(config.host + '/login?from=extension&like=' + escape(tab.url));
    }

    likes.isLiked(tab.url, liked => {
      likes[liked ? "unlike" : "like"](tab.url, err => {
        if (err) return console.error(err)
        icons.set(!liked)
      })
    })
  })
}
