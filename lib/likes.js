import { db } from './db'

export function isLiked (url, callback) {
  if (!url) return callback(false)

  db.likes.get(url, (err, row) => {
    callback(!err && row)
  })
}

export function like (url, callback) {
  db.likes.like(url, callback)
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
