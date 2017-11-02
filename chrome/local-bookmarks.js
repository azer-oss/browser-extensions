export function all (callback) {
  chrome.bookmarks.getTree(function (results) {
    callback(undefined, flatten(results).filter(isBookmark))
  })
}

function isBookmark (row) {
  return row.url && row.url.length > 0
}

function flatten (list, result, map) {
  if(!Array.isArray(list)) return list;

  var i = -1;
  var len = list.length;

  result || (result = []);
  map || (map = {})

  while (++i < len) {
    if (Array.isArray(list[i])) {
      flatten(list[i], result, map)
      continue
    }

    if (Array.isArray(list[i].children)) {
      flatten(list[i].children, result, map)
      continue
    }

    if (list[i].url && list[i].url.indexOf('http') === 0) {
      if (map[list[i].url]) continue

      map[list[i].url] = true

      result.push({
        title: list[i].title,
        url: list[i].url,
        addedAt: list[i].dateAdded
      })
    }
  }

  return result;
}
