import * as localBookmarks from "./local-bookmarks"
import RemoteTasks from "../lib/remote-tasks"
import urls from "urls"
import settings from "./settings"
import * as api from "../lib/api"
import * as auth from '../lib/auth'
import { current as getCurrentTab } from "./tabs"
import { db, onError, onPostUpdates, onReceiveUpdates } from "../lib/db"
import { version }  from "../chrome-dist/manifest.json"

const HOMEPAGE_FILTER_THRESHOLD = 5

export default class BackgroundTasks extends RemoteTasks {
  constructor() {
    super()

    this.name = 'kozmos:background'
    this.map({
      'get-local-bookmarks': this.getLocalBookmarks,
      'get-recent-bookmarks': auth.requiresAuth(this.getRecentBookmarks),
      'search-bookmarks': auth.requiresAuth(this.searchBookmarks),
      'get-website': auth.requiresAuth(this.getWebsite),
      'is-logged-in': this.isLoggedIn,
      'set-user': this.setUser,
      'get-user': auth.requiresAuth(this.getUser),
      'get-name': auth.requiresAuth(this.getName),
      'like': this.like,
      'unlike': this.unlike,
      'get-like': this.getLike,
      'get-version': this.getVersion,
      'get-settings-value': this.getSettingsValue,
      'set-settings-value': this.setSettingsValue,
      'list-settings': this.getListOfSettings
    })

    onError((err, action) => {
      console.log('Database error during %s: %s', action, err)
    })

    onPostUpdates(() => this.lastPostedUpdatesAt = Date.now())
    onReceiveUpdates(() => this.lastReceivedUpdatesAt = Date.now())
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
    const options = {
      size: 25,
      from: 0,
      filter_by_user: true
    }

    api.post('/api/search', options, (error, content) => {
      this.reply(msg, { content, error })
    })
  }

  searchBookmarks(msg) {
    const options = {
      query: msg.content.query,
      size: 25,
      from: 0,
      filter_by_user: true
    }

    if (/^\w+$/.test(options.query) && options.query.length < HOMEPAGE_FILTER_THRESHOLD) {
      options.filter_by_homepage = true
    }

    api.post('/api/search', options, (error, content) => {
      this.reply(msg, { content, error })
    })
  }

  getWebsite(msg) {
    let query = msg.content.query
    if (msg.content.query.indexOf('.com') === -1) {
      query += '.com'
    }

    const options = {
      query: query,
      size: 25,
      from: 0,
      filter_by_typo: true,
      filter_by_user: false
    }

    api.post('/api/search', options, (error, content) => {
      this.reply(msg, { content, error })
    })
  }

  getLocalBookmarks(msg) {
    localBookmarks.all((error, content) => {
      this.reply(msg, { content, error })
    })
  }

  isLoggedIn(msg) {
    this.reply(msg, {
      isLoggedIn: auth.isLoggedIn()
    })
  }

  getName(msg) {
    const user = auth.read()
    const profile = user ? user.profile : null

    this.reply(msg, {
      name: profile ? profile.name : user ? user.name : localStorage['name']
    })
  }

  getUser(msg) {
    const user = auth.read()
    if (user) {
      this.reply(msg, { user })
    } else {
      this.reply(msg, { error: new Error('Auth error') })
    }
  }

  setUser(msg) {
    let parsed

    try {
      parsed = JSON.parse(msg.content.user)
    } catch (err) {
      this.reply(msg, { error: new Error('Bad user') })
    }

    console.log('Kozmos extension received user auth info.')
    auth.save(msg.content.user)

    db.setAPIAccessToken(parsed.access_token.key, parsed.access_token.secret)
  }

  getSettingsValue(msg) {
    this.reply(msg, { value: settings.get(msg.content.key) })
  }

  setSettingsValue(msg) {
    this.reply(msg, { value: settings.set(msg.content.key, msg.content.value) })
  }

  getListOfSettings(msg) {
    this.reply(msg, { settings: settings.all() })
  }

  getVersion(msg) {
    this.reply(msg, { version })
  }

  listenForMessages() {
    chrome.runtime.onMessage.addListener(msg => this.onReceive(msg))
  }

  sendMessage(msg) {
    if (msg.to === 'kozmos:popup') {
      return chrome.runtime.sendMessage(msg)
    }

    getCurrentTab((err, tab) => {
      if (err) throw err
      chrome.tabs.sendMessage(tab.id, msg)
    })
  }
}
