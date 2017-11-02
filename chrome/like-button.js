import icons from "./icons"
import tabs from "./tabs"
import config from "../config"
import { get as getToken } from "./token"
import * as likes from "../lib/likes"
import * as db from "../lib/db"

export function init () {
  login(function (error, token) {
    if (error) return console.error('User isn\'t logged into Kozmos')
    db.setToken(token)
  })

  icons.listenForChanges()
  chrome.browserAction.onClicked.addListener(onClick)
}

function onClick (tab) {
  getToken(error => {
    if (error) {
      return tabs.create(config.host + '/login?from=extension&like=' + escape(tab.url));
    }

    db.setToken(localStorage['token'])

    likes.isLiked(tab.url, liked => {
      if (!liked) {
        like(tab.url, tab.title)
      } else {
        unlike(tab.url)
      }
    })
  })
}

function like (url, title) {
  likes.like(url, title, err => {
    if (err) return console.error('Can not like: %s', err.message)
    icons.set(true)
  })
}

function unlike (url, title) {
  likes.unlike(url, err => {
    if (err) return console.error('Can not unlike: %s', err.message)
    icons.set(false)
  })
}

function login (callback) {
  const url = `${config.host}/login`

  getToken(err => {
    if (err) {
      tabs.create(url)
      return callback(err)
    }

    callback(undefined, localStorage['token'])
  })
}
