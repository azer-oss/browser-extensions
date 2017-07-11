export function all (callback) {
  chrome.bookmarks.getTree(function (results) {
    callback(undefined, flatten(results).filter(isBookmark))
  })
}

function isBookmark (row) {
  return typeof row[0] !== 'undefined' && row[0].length > 0
}

function flatten (list, result) {
  if(!Array.isArray(list)) return list;

  var i = -1;
  var len = list.length;

  result || (result = []);

  while (++i < len) {
    if (Array.isArray(list[i])) {
      flatten(list[i], result)
      continue
    }

    if (Array.isArray(list[i].children)) {
      flatten(list[i].children, result)
      continue
    }

    if (list[i].url && list[i].url.indexOf('http') === 0) {
      result.push([list[i].url, String(Math.floor(list[i].dateAdded / 1000))]);
    }
  }

  return result;
}
