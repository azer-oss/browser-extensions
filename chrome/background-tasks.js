import * as localBookmarks from "./local-bookmarks"
import RemoteTasks from "../lib/remote-tasks"
import tabs from "./tabs"
import urls from "urls"
import { db } from "../lib/db"
import { get as auth } from "./token"

export default class BackgroundTasks extends RemoteTasks {
  constructor() {
    super()
    this.name = 'kozmos:background'
    this.map({
      'get-local-bookmarks': this.getLocalBookmarks,
      'get-recent-bookmarks': this.getRecentBookmarks,
      'search-bookmarks': this.searchBookmarks,
      'is-logged-in': this.isLoggedIn,
      'set-token': this.setToken,
      'like': this.like,
      'unlike': this.unlike,
      'get-like': this.getLike
    })
  }

  getLike(msg) {
    if (!msg.content.url) return this.reply(msg, { like: null })

    db.likes.get(urls.clean(msg.content.url), (err, row) => {
      if (row) return this.reply(msg, { like: row })

      db.likes.get(msg.content.url, (err, row) => {
        return this.reply(msg, { like: row })
      })
    })
  }

  like(msg) {
    db.likes.like(msg.content.url, msg.content.title, (err) => {
      if (err) return this.reply(msg, { error: err })

      db.likes.get(urls.clean(msg.content.url), (err, row) => {
        if (row) return this.reply(msg, { like: row })
      })
    })
  }

  unlike(msg) {
    db.likes.unlike(urls.clean(msg.content.url), err => {
      return this.reply(msg, { error: err })
    })
  }

  getRecentBookmarks(msg) {
    auth(error => {
      if (error) return this.reply(msg, { error })

      api.post('/api/recent', {}, (error, content) => {
        this.reply(msg, { content, error })
      })
    })
  }

  searchBookmarks(msg) {
    auth(error => {
      if (error) return this.reply(msg, { error })

      api.post('/api/search', { query: msg.content.query }, (error, content) => {
        this.reply(msg, { content, error })
      })
    })
  }

  getLocalBookmarks(msg) {
    localBookmarks.all((error, content) => {
      this.reply(msg, { content, error })
    })
  }

  isLoggedIn(msg) {
    this.reply(msg, { isLoggedIn: !!localStorage['token'] })
  }

  setToken(msg) {
    localStorage['token'] = msg.content.token
    db.setToken(msg.content.token)
  }

  listenForMessages() {
    chrome.runtime.onMessage.addListener(msg => this.onReceive(msg))
  }

  sendMessage(msg) {
    if (msg.to === 'kozmos:popup') {
      return chrome.runtime.sendMessage(msg)
    }


    tabs.current((err, tab) => {
      if (err) throw err

      chrome.tabs.sendMessage(tab.id, msg)
    })
  }
}
