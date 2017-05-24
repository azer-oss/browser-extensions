var lastURL = ''

module.exports = {
  create,
  current,
  onUpdated
}

function create (url) {
  safari.application.activeBrowserWindow.openTab().url = url
}

function current () {
  return safari.application.activeBrowserWindow.activeTab
}

function onUpdated (callback) {
  safari.application.addEventListener("activate", onchange, true);
  safari.application.addEventListener("beforeNavigate", onchange, true);
  safari.application.addEventListener("navigate", onchange, true);

  check()

  function onchange (event) {
    if (current().url === lastURL) return
    lastURL = current().url
    callback()
  }

  function check () {
    onchange()
    setTimeout(check, 500)
  }
}
