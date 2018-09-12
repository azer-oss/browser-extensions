import * as localBookmarks from "./local-bookmarks"
import RemoteTasks from "../lib/remote-tasks"
import urls from "urls"
import settings from "./settings"
import * as api from "../lib/api"
import * as auth from "../lib/auth"
import { current as getCurrentTab } from "./tabs"
import {
  db,
  setAPIAccessToken as setDBAPIAccessToken,
  onError,
  onPostUpdates,
  onReceiveUpdates
} from "../lib/db"
import { version } from "../chrome-dist/manifest.json"

const HOMEPAGE_FILTER_THRESHOLD = 5

export default class BackgroundTasks extends RemoteTasks {
  constructor() {
    super()

    this.name = "kozmos:background"
    this.map({
      "get-local-bookmarks": this.getLocalBookmarks,
      "get-recent-bookmarks": this.promise(this.getRecentBookmarks),
      "get-bookmarks-by-tag": this.promise(this.getBookmarksByTag),
      "search-bookmarks": auth.requiresAuth(this.searchBookmarks),
      autocomplete: this.promise(this.autocomplete),
      "get-tags-of-bookmark": this.promise(this.getTagsOfBookmark),
      "add-tags": this.promise(this.addTags),
      "delete-tag": this.promise(this.deleteTag),
      "is-logged-in": this.isLoggedIn,
      "set-user": this.setUser,
      "get-user": auth.requiresAuth(this.getUser),
      "get-name": auth.requiresAuth(this.getName),
      like: this.promise(this.addBookmark),
      unlike: this.promise(this.removeBookmark),
      "update-title": this.promise(this.updateTitle),
      "get-like": this.promise(this.getBookmark),
      "get-version": this.getVersion,
      "get-settings-value": this.getSettingsValue,
      "set-settings-value": this.setSettingsValue,
      "list-settings": this.getListOfSettings
    })

    onError((err, action) => {
      console.log("Database error during %s: %s", action, err)
    })

    onPostUpdates(() => (this.lastPostedUpdatesAt = Date.now()))
    onReceiveUpdates(() => (this.lastReceivedUpdatesAt = Date.now()))
  }

  async getBookmark(msg) {
    const like = await db.get(msg.content.url)
    return { like }
  }

  async addBookmark(msg) {
    await db.add(msg.content)
    const like = await db.get(msg.content.url)
    return { like }
  }

  async removeBookmark(msg) {
    await db.delete(msg.content.url)
  }

  async getRecentBookmarks(msg) {
    const content = await db.recent(25)
    return { content }
  }

  async getBookmarksByTag(msg) {
    const content = await db.listByTag(msg.content.tag, { limit: 25 })
    return { content }
  }

  async addTags(msg) {
    msg.content.tags.forEach(async tag => {
      await db.tag(msg.content.url, tag)
    })
  }

  async deleteTag(msg) {
    await db.untag(msg.content.url, msg.content.tag)
  }

  async updateTitle(msg) {
    await db.updateTitle(msg.content.url, msg.content.title)
  }

  searchBookmarks(msg) {
    const options = {
      query: msg.content.query,
      size: 25,
      from: 0,
      filter_by_user: true
    }

    api.post("/api/search", options, (error, resp) => {
      if (error) return this.reply(msg, { error })

      this.reply(msg, {
        content: resp.results.likes,
        total: resp.results.total_rows
      })
    })
  }

  async autocomplete(msg) {
    const query = msg.content.query
    const byUrl = await db.searchByUrl(query)
    const byTitle = await db.searchByTitle(query)
    const byTags = await db.searchByTags(query)
    const urls = {}
    const uniques = byUrl
      .concat(byTitle)
      .concat(byTags)
      .filter(row => {
        if (urls[row.url]) return false
        urls[row.url] = true
        return true
      })

    return { content: uniques }
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
      name: profile ? profile.name : user ? user.name : localStorage["name"]
    })
  }

  getUser(msg) {
    const user = auth.read()
    if (user) {
      this.reply(msg, { user })
    } else {
      this.reply(msg, { error: new Error("Auth error") })
    }
  }

  setUser(msg) {
    let parsed

    try {
      parsed = JSON.parse(msg.content.user)
    } catch (err) {
      this.reply(msg, { error: new Error("Bad user") })
    }

    console.log("Kozmos extension received user auth info.")
    auth.save(msg.content.user)

    setDBAPIAccessToken(parsed.access_token.key, parsed.access_token.secret)
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
    if (msg.to === "kozmos:popup") {
      return chrome.runtime.sendMessage(msg)
    }

    getCurrentTab((err, tab) => {
      if (err) throw err
      chrome.tabs.sendMessage(tab.id, msg)
    })
  }

  promise(fn) {
    return async msg => {
      try {
        const result = await fn.call(this, msg)
        this.reply(msg, result || {})
      } catch (error) {
        console.error("Background task failed", error)
        this.reply(msg, { error })
      }
    }
  }
}
