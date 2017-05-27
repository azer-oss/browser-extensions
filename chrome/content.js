const config = require("../config")

chrome.runtime.onMessage.addListener(onMessageFromBackground)
addEventListener("message", onMessageFromWeb)

function send (id, content, error) {
  postMessage({
    from: 'kozmos-extension',
    id, error, content
  }, config.host)
}

function onMessageFromWeb (e) {
  if (e.data.from !== 'kozmos-web') return;

  if (e.data.content && e.data.content.ping) {
    return send(e.data.id, 'pong')
  }

  chrome.runtime.sendMessage(e.data, function (resp) {
    if (resp) {
      send(e.data.id, resp.content, resp.error)
    }
  })
}

function onMessageFromBackground (msg) {
  send(msg.id, msg.content, msg.error)
}
