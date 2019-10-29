import * as likes from "../lib/likes"
import * as tabs from "./tabs"

export function listenForChanges() {
  tabs.onUpdated(onTabsUpdated)
}

export function onTabsUpdated() {
  tabs.current((error, tab) => {
    if (error) return console.error(error)
    likes.isLiked(tab.url, set)
  })
}

export function set(liked) {
  const path = "./images/heart-icon" + (liked ? "-liked" : "") + ".png"
  const title = liked
    ? "Click to delete it from your likes"
    : "Click to add it to your likes"

  chrome.browserAction.setIcon({ path })
  chrome.browserAction.setTitle({ title })
}
