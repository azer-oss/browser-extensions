import * as config from '../config'
import * as auth from './auth'

export function get (url, callback) {
  sendJSON('GET', url, null, callback)
}

export function post (url, data, callback) {
  sendJSON('POST', url, data, callback)
}

export function put (url, data, callback) {
  sendJSON('PUT', url, data, callback)
}

export function deleteFn (url, data, callback) {
  sendJSON('DELETE', url, data, callback)
}

function sendJSON (method, url, data, callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open(method, config.host + url);

  const user = auth.read()
  if (user) {
    xmlhttp.setRequestHeader("X-API-Key", user.access_token && user.access_token.key)
    xmlhttp.setRequestHeader("X-API-Secret", user.access_token && user.access_token.secret)
  } else {
    // Keep using deprecated token for temporary time
    xmlhttp.setRequestHeader("X-API-Token", auth.getDeprecatedToken())
  }

  if (data) {
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(data));
  } else {
    xmlhttp.send(null);
  }

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState !== 4) {
      return
    }

    if (xmlhttp.status >= 500) {
      return callback(new Error(parsed.error))
    }

    if (xmlhttp.status == 401) {
      return callback(new Error('Unauthorized (401)'))
    }

    if (xmlhttp.status == 404) {
      return callback(new Error('Not found'))
    }

    if (xmlhttp.status >= 300) {
      return callback(new Error('Request error: ' + xmlhttp.status))
    }

    var parsed = null
    var err = null

    try {
      parsed =JSON.parse(xmlhttp.responseText)
    } catch(e) {
      err = new Error('An error happened')
    }

    callback(err, parsed)
  }
}
