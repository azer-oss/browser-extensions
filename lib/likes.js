import urls from "urls"
import { db } from "./db"

export function isLiked(url, callback) {
  db.get(url)
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
