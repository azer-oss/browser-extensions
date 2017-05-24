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
  safari.application.addEventListener("activate", callback, true);
}
