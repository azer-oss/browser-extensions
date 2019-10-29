import urls from "urls"
import { db } from "./db"

export function isLiked(url, callback) {
  isSavedAsBookmark(url)
    .then(row => callback(!!row))
    .catch(() => callback(false))
}

export function like(url, title, callback) {
  db.add({ url, title })
    .then(callback)
    .catch(callback)
}

export function unlike(url, callback) {
  db.delete(url)
    .then(callback)
    .catch(callback)
}

export function toggle(url, callback) {
  isLiked(url, function(liked) {
    if (liked) return unlike(url, callback)
    like(url, callback)
  })
}

async function isSavedAsBookmark(url) {
  const saved = await db.get(url)
  if (saved) return true

  const matched = await db.bookmarksStore.getByIndex(
    "cleanUrl",
    urls.clean(url)
  )

  return !!matched
}
