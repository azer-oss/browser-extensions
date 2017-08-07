import { read } from './cookies'

export function get (callback) {
  if (localStorage['token']) {
    return callback(undefined, localStorage['token'])
  }

  readFromCookie(callback)
}

export function readFromCookie (callback) {
  const result = {};

  read("token", (error, token) => {
    if (!value) return callback(new Error('Token isn\'t set'))

    localStorage['token'] = token

    read("name", (error, name) => {
      if (!value) return callback(new Error('Name isn\'t set'))
      result.name = value;

      localStorage['name'] = name

      callback(undefined, token, name)
    })
  })
}
