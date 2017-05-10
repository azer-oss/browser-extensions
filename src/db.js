const db = require("db")
const loop = require("limited-parallel-loop")

module.exports = {
  importLikes: importLikes
}

function importLikes (rows, callback) {
  var failed = 0

  loop(rows.length, 50, each, function () {
    if (failed) return callback(new Error("Failed to import " + failed + "likes."))
    callback()
  })

  function each (done, index) {
    db.likes.like(rows[index], function (error) {
      if (error) {
        failed++
        console.error(error)
      }

      done()
    })
  }
}
