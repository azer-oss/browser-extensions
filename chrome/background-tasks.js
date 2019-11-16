import titleFromURL from "title-from-url"
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
      "get-collections": this.promise(this.getCollections),
      "get-recent-bookmarks": this.promise(this.getRecentBookmarks),
      "get-bookmarks-by-tag": this.promise(this.getBookmarksByTag),
      "get-bookmarks-by-collection": this.promise(
        this.getBookmarksByCollection
      ),
      "search-bookmarks": auth.requiresAuth(this.searchBookmarks),
      autocomplete: this.promise(this.autocomplete),
      "get-tags-of-bookmark": this.promise(this.getTagsOfBookmark),
      "add-tags": this.promise(this.addTags),
      "delete-tag": this.promise(this.deleteTag),
      "is-logged-in": this.isLoggedIn,
      "has-payment-method": this.hasPaymentMethod,
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
      "suggest-tags": this.promise(this.suggestTags),
      "suggest-collections": this.promise(this.suggestCollections),
      "list-settings": this.getListOfSettings,
      "set-selected-view": this.setSelectedView,
      "get-selected-view": this.getSelectedView,
      "add-to-collection": this.addToCollection,
      "remove-from-collection": this.removeFromCollection,
      "get-collections-of-url": this.getCollectionsOfUrl,
      "get-recent-collections": this.getRecentCollections,
      "get-speed-dial": this.getSpeedDial,
      "list-speed-dials": this.listSpeedDials,
      "search-speed-dials": this.searchSpeedDials,
      "add-to-speed-dial": this.addToSpeedDial,
      "remove-speed-dial": this.removeSpeedDial,
      "get-current-speed-dial": this.getCurrentSpeedDial,
      "update-collection": this.updateCollection,
      "delete-collection": this.deleteCollection
    })

    onError((err, action) => {
      console.error("Database Error:", action, err)
      console.error(err.message)
      console.error(err.stack)
      setImmediate(() => {
        throw err
      })
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

  async getCollections(msg) {
    const content = await db.listCollections()
    const mapped = await Promise.all(
      content.map(async c => {
        const content = await db.listByCollection(c.title)
        const result = Object.assign({}, c)
        result.isEmpty = content.length === 0
        return result
      })
    )

    const filtered = mapped.filter(c => !c.isEmpty)

    return { content: filtered }
  }

  async getBookmarksByTag(msg) {
    const content = await db.listByTag(msg.content.tag, { limit: 25 })
    return { content }
  }

  async getBookmarksByCollection(msg) {
    const content = await db.listByCollection(msg.content.collection, {
      limit: msg.content.limit,
      offset: msg.content.offset
    })

    const mapped = await Promise.all(content.map(c => addBookmarkTitle(c)))

    if (msg.content.filter) {
      let filtered = mapped.filter(
        m =>
          m.title.includes(msg.content.filter) ||
          m.cleanTitle.includes(msg.content.filter) ||
          m.url.includes(msg.content.filter)
      )

      if (
        mapped.length === msg.content.limit &&
        filtered.length < msg.content.limit
      ) {
        const additional = await this.getBookmarksByCollection({
          content: {
            filter: msg.content.filter,
            collection: msg.content.collection,
            limit: mapped.length - filtered.length,
            offset: msg.content.offset + msg.content.limit
          }
        })

        return { content: filtered.concat(additional.content) }
      }

      return { content: filtered }
    }

    return { content: mapped }
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

  async suggestTags(msg) {
    const query = msg.content.query
    const rows = await db.searchByTags(query)
    const found = {}

    const taggedWith = await db.listByTag(query, {})
    if (taggedWith.length > 0) found[query] = true

    rows.forEach(row => {
      row.tags.forEach(t => {
        if (found[t]) return
        if (t.indexOf(query) === -1) return
        found[t] = true
      })
    })

    const suggestions = Object.keys(found).sort((a, b) => {
      if (a === query) {
        return -1
      }

      if (b === query) {
        return 1
      }

      if (a.indexOf(query) === 0) {
        return -1
      }

      if (b.indexOf(query) === 0) {
        return 1
      }

      if (a.length < b.length) {
        return -1
      }

      if (b.length < a.length) {
        return 1
      }

      return 0
    })

    return { suggestions }
  }

  async suggestCollections(msg) {
    const query = msg.content.query
    const rows = await db.searchCollections(query)

    return { suggestions: rows }
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

  hasPaymentMethod(msg) {
    this.reply(msg, {
      hasPaymentMethod: auth.hasPaymentMethod()
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

  setSelectedView(msg) {
    localStorage["selected-view"] = msg.content.selectedView
    this.reply(msg, { selectedView: msg.content })
  }

  getSelectedView(msg) {
    this.reply(msg, { selectedView: localStorage["selected-view"] })
  }

  async addToCollection(msg) {
    await db.addToCollection({
      collection: msg.content.collection,
      url: msg.content.url
    })

    this.reply(msg, { ok: true })
  }

  async removeFromCollection(msg) {
    await db.removeFromCollection(msg.content.url, msg.content.collection)
    this.reply(msg, { ok: true })
  }

  async getCollectionsOfUrl(msg) {
    const collections = await db.getCollectionsOfUrl(msg.content.url)
    this.reply(msg, { collections })
  }

  async getRecentCollections(msg) {
    const collections = await db.getRecentCollections()
    this.reply(msg, { collections })
  }

  async getCurrentSpeedDial(msg) {
    const speedDial = await db.getSpeedDialByUrl(msg.content.url)
    this.reply(msg, { speedDial })
  }

  async getSpeedDial(msg) {
    const speeddial = await db.getSpeedDialByKey(msg.content.key)
    this.reply(msg, { speeddial: await addBookmarkTitle(speeddial) })
  }

  async addToSpeedDial(msg) {
    await db.addSpeedDial({ key: msg.content.key, url: msg.content.url })
    this.reply(msg, { ok: true })
  }

  async removeSpeedDial(msg) {
    await db.removeSpeedDialByUrl(msg.content.url)
    this.reply(msg, { ok: true })
  }

  async searchSpeedDials(msg) {
    const results = await db.searchSpeedDials(msg.content.query)
    this.reply(msg, { results })
  }

  async listSpeedDials(msg) {
    const results = await db.listSpeedDials()
    this.reply(msg, { results })
  }

  async updateCollection(msg) {
    const results = await db.updateCollection(msg.content.titleToUpdate, {
      title: msg.content.title,
      description: msg.content.description
    })

    this.reply(msg, { ok: true })
  }

  async deleteCollection(msg) {
    await db.removeCollection(msg.content.title)
    this.reply(msg, { ok: true })
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

async function addBookmarkTitle(record) {
  if (!record || !record.url) {
    return record
  }

  const bookmark = await db.get(record.url)
  if (!bookmark) {
    return Object.assign(record, { title: titleFromURL(record.url) })
  }

  return Object.assign(bookmark, {
    title: bookmark.title,
    description: bookmark.description
  })
}
