const config = require("../config")

module.exports = {
  sendJSON,
  get,
  post,
  put,
  delete: deleteFn
}

function sendJSON (method, url, data, callback) {
  const token = localStorage['token']

  if (!token) return callback(new Error('Login required.'))

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open(method, config.host + url);

  xmlhttp.setRequestHeader("X-API-Token", token)

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
      localStorage['token'] = ""
      localStorage['name'] = ""
      return callback(new Error('Unauthorized'))
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

function get (url, callback) {
  sendJSON('GET', url, null, callback)
}

function post (url, data, callback) {
  sendJSON('POST', url, data, callback)
}

function put (url, data, callback) {
  sendJSON('PUT', url, data, callback)
}

function deleteFn (url, data, callback) {
  sendJSON('DELETE', url, data, callback)
}
