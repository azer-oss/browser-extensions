module.exports = {
  create,
  current,
  onUpdated
}

function create (url) {
  chrome.tabs.create({ url: url })
}

function current (callback) {
  chrome.tabs.query({ 'active': true, currentWindow: true }, function (tabs) {
    callback(undefined, tabs[0]);
  });
}


function onUpdated (callback) {
  chrome.tabs.onUpdated.addListener(callback)
  chrome.tabs.onActivated.addListener(callback)
}
