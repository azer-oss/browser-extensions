const db = require("db")

module.exports = {
  all: all,
  pull: pull,
  push: push
}

function all (callback) {
  pull(function (error) {
    if (error) return callback(error)

    push(callback)
  })
}

function push (callback) {
  const urls = []
}
