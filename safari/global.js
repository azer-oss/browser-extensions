const config = require("../config")
const icons = require("./icons")
const tabs = require("./tabs")
const likes = require("../lib/likes")
const db = require("../lib/db")

icons.listenForChanges()

safari.application.addEventListener("command", function (event) {
  const url = tabs.current().url
  const title = tabs.current().title

  if (!localStorage['token']) {
    return tabs.create(config.host + '/login?from=extension&like=' + escape(url))
  }

  likes.isLiked(url, function (liked) {
    if (!liked) {
      likes.like(url, title, updateIcons(liked))
    } else {
      likes.unlike(url, updateIcons(liked))
    }
  })
});

safari.application.addEventListener("message", function (event) {
  if (event.name === 'kozmos-token') {
    localStorage['token'] = event.message
    db.setToken(event.message)
  }

  if (event.name === 'kozmos-update-icon') {
    icons.onCurrentURLUpdated({ target: { url: event.message } })
  }
});

function updateIcons(liked) {
  return function (err) {
    if (err)
      return console.error(err);
    if (liked)
      icons.setAsNotLiked();
    else
      icons.setAsLiked();
  };
}
