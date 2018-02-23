import * as config from "../config"
import * as auth from "../lib/auth"
import { openLoginWindow } from "./tabs"
import * as likes from '../lib/likes'
import * as icons from './icons'

export function init () {
  icons.listenForChanges()
  chrome.browserAction.onClicked.addListener(onClick)
}

function verifyAuth (tab) {
  if (!auth.isLoggedIn()) {
    return openLoginWindow(tab.url)
  }

  likes.isLiked(tab.url, liked => {
    if (!liked) {
      like(tab.url, tab.title)
    } else {
      unlike(tab.url)
    }
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
