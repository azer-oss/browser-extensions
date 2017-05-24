const config = require("../config")
const icons = require("./icons")
const tabs = require("./tabs")
const likes = require("../lib/likes")

icons.listenForChanges()

safari.application.addEventListener("command", function (event) {
  const url = tabs.current().url

  if (!localStorage['token']) {
    return tabs.create(config.host + '/login?from=extension&like=' + escape(url))
  }

  likes.isLiked(url, function (liked) {
    likes[liked ? "unlike" : "like"](url, function (err) {
      if (err) return console.error(err)

      if (liked) icons.setAsNotLiked()
      else icons.setAsLiked()
    })
  })
});

safari.application.addEventListener("message", function (event) {
  if (event.name === 'kozmos-token') {
    console.log('=>', event.message)
    localStorage['token'] = event.message
  }
});
