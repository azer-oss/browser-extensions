const config = require("../config")

if (window.location.host === config.host.replace(/^\w+:\/\//, '')) {
  sendToken()
  window.addEventListener("hashchange", sendToken, false);
}

function sendToken () {
  safari.self.tab.dispatchMessage("kozmos-token", localStorage['token']);
}

function url () {
  return window.location.url
}
