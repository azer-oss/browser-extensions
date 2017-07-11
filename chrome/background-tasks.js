import * as localBookmarks from "./local-bookmarks"
import RemoteTasks from "../lib/remote-tasks"
import tabs from "./tabs"
import api from "../lib/api"
import { auth } from "./user"


export default class BackgroundTasks extends RemoteTasks {
  constructor() {
    super()
    this.name = 'kozmos:background'
    this.map({
      'get-local-bookmarks': this.getLocalBookmarks,
      'get-recent-bookmarks': this.getRecentBookmarks,
      'search-bookmarks': this.searchBookmarks,
      'is-logged-in': this.isLoggedIn
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

  isLoggedIn() {
    this.reply(msg, { isLoggedIn: !!localStorage['token'] })
  }

  listenForMessages() {
    chrome.runtime.onMessage.addListener(msg => this.onReceive(msg))
  }

  sendMessage(msg) {
    tabs.current((err, tab) => {
      if (err) throw err

      chrome.tabs.sendMessage(tab.id, msg)
    })
  }
}
