import parse from 'bookmark-backup-parser'

export function all (callback) {
  chrome.bookmarks.getTree(function (results) {
    callback(undefined, parse(JSON.stringify(results)))
  })
}
