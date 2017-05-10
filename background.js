const tabs = require("./src/tabs")
const icons = require("./src/icons")
const likes = require("./src/likes")
const login = require("./src/login")
const db = require("./src/db")
const config = require("./config")

tabs.onUpdated(icons.update)
chrome.runtime.onMessage.addListener(onMessage)

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

function onMessage (msg, sender, reply) {
  if (msg.task === undefined) {
    return reply({ error: "Unspecified background task." })
  }

  if (msg.task === "import") {
    db.importLikes(msg.urls, function (err) {
      reply({
        error: err ? err.message : null
      })
    })

    return true;
  }

  reply({
    error: "Unknown task: " + msg.task
  })
}
