const likes = require("../lib/likes")
const config = require("../config")
const icons = require("./icons")
const user = require("./user")
const tabs = require("./tabs")
const bookmarks = require("./bookmarks")

icons.listenForChanges()
chrome.browserAction.onClicked.addListener(onClick)
chrome.runtime.onMessage.addListener(onMessage)

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

function onMessage (msg, sender, reply) {
  if (msg.content.task === undefined) {
    return reply({ error: "Unspecified background task." })
  }

  if (msg.content.task === 'bookmarks') {
    return getAllBookmarksTask(msg.id)
  }

  console.info('Background received an unfamiliar message', msg)
}

function getAllBookmarksTask (id) {
  bookmarks.all(function (error, content) {
    send({ content, id, error })
  })
}

function send (msg) {
  tabs.current((err, tab) => {
    if (err) throw err

    chrome.tabs.sendMessage(tab.id, msg)
  })
}
