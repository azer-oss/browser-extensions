const api = require("./api")

module.exports = {
  isLiked,
  toggle,
  like,
  unlike
}

function isLiked (url, callback) {
  api.get('/api/like?url=' + escape(url), function (error) {
    callback(!error)
  })
}

function like (url, callback) {
  api.put('/api/like', { url }, callback)
}

function unlike (url, callback) {
  api.delete('/api/like', { url }, callback)
}

function toggle (url, callback) {
  isLiked(url, liked => {
    if (liked) return unlike(url, callback)
    like(url, callback)
  })
}
