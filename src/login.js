const read = require("./cookies").read

module.exports = login

function login (callback) {
  const result = {};
  read("token", (error, value) => {
    if (!value) return callback(new Error('Token isn\'t set'))

    result.token = value

    read("name", (error, value) => {
      if (!value) return callback(new Error('Name isn\'t set'))
      result.name = value;
      callback(undefined, result)
    })
  })
}
