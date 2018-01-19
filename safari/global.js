import { db, setToken, isTokenSet } from "../lib/db"

const config = require("../config")
const icons = require("./icons")
const iconListen = require("./iconListen")
const tabs = require("./tabs")
const likes = require("../lib/likes")
const urls = require("urls")

iconListen.listenForChanges()

if (!isTokenSet() && localStorage['token']) {
  setToken(localStorage['token']);
}


safari.application.addEventListener("command", function (event) {
  const url = tabs.current().url
  const title = tabs.current().title

  if (!localStorage['token']) {
    return tabs.create(config.host + '/login?from=extension&like=' + escape(url))
  }
});

safari.application.addEventListener("message", function (event) {
  if (event.name === 'kozmos-token') {
    localStorage['token'] = event.message
    setToken(event.message)
  }
});

function listenForPopover() {
  safari.application.addEventListener("popover", (event) => {
    if (event.target.identifier !== "kozmosPopover") {
      return;
    }
    safari.extension.popovers[0].contentWindow.Popover.updatePopover();
  }, true);
}
window.listenForPopover = listenForPopover;

function getLike(url) {
  return new Promise((res) => {
    db.likes.get(urls.clean(url), (err, row) => {
      if (row) res({ like: row })

      db.likes.get(url, (err, row) => {
        res({ like: row })
      })
    })
  })
}
window.getLike = getLike;

function like(url, title) {
  return new Promise((res) => {
    likes.like(url, title, (err) => {
      if (err) {
        res({ error: err })
      }

      likes.get(url, (err, row) => {
        if (row) {
          res({ like: row });
        }
      })
    })
  });
}
window.like = like;
window.db = db;

function unlike(url) {
  return new Promise((res) => {
    likes.unlike(urls.clean(url), err => {
      res({ error: err });
    })
  })
}
window.unlike = unlike;

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
