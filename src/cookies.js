const host = require("../config").host

module.exports = {
  read: read,
  onChange: onChange
}

function onChange (name, callback) {
  chrome.cookies.addListener({ url: host(), "name": name }, function (cookie) {
    callback(undefined, cookie.value)
  })
}

function read (name, callback) {
  chrome.cookies.get({ url: host(), "name": name }, function (cookie) {
    callback(undefined, cookie && cookie.value)
  })
}
