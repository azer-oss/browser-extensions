import urls from "urls"
import { db } from './db'

export function isLiked (url, callback) {
  if (!url) return callback(false)

  db.likes.get(urls.clean(url), (err, row) => {
    if (row) return callback(true)

    db.likes.get(url, (err, row) => {
      callback(!err && row)
    })
  })
}

export function like (url, title, callback) {
  db.likes.like(url, title, callback)
}

export function unlike (url, callback) {
  db.likes.unlike(url, callback)
}

export function toggle (url, callback) {
  isLiked(url, function (liked) {
    if (liked) return unlike(url, callback)
    like(url, callback)
  })
}
