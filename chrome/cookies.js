import { host } from '../config'

export function onChange (name, callback) {
  chrome.cookies.addListener({ url: host, "name": name }, function (cookie) {
    callback(undefined, cookie.value)
  })
}

export function read (name, callback) {
  chrome.cookies.get({ url: host, "name": name }, function (cookie) {
    callback(undefined, cookie && cookie.value)
  })
}
