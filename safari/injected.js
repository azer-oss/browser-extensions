const config = require("../config")

addEventListener("message", function (e) {
  console.log('message to injected', e.data, config.host)

  if (e.data.from !== 'kozmos-web' || e.data.content === undefined) return;
  if (e.data.content === 'ping' || e.data.content.ping) send(e.data.id, 'pong')
  if (e.data.content.task === 'bookmarks') send (e.data.id, [])
})


if (window.location.host === config.host.replace(/^\w+:\/\//, '')) {
  sendToken()
  window.addEventListener("hashchange", sendToken, false);
}

function sendToken () {
  safari.self.tab.dispatchMessage("kozmos-token", localStorage['token']);
}

function url () {
  return window.location.href
}

function send (id, content, error) {
  postMessage({
    from: 'kozmos-extension',
    id: id,
    content: content,
    error: error
  }, config.host)
}
