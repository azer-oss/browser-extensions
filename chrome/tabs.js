import * as config from "../config"

export function openLoginWindow (likeURL) {
  create(config.host + '/login?from=extension&like=' + escape(likeURL))
}

export function create (url) {
  chrome.tabs.create({ url: url })
}

export function current (callback) {
  chrome.tabs.query({ 'active': true, currentWindow: true }, function (tabs) {
    if (tabs[0]) callback(undefined, tabs[0]);

    chrome.tabs.query({ 'active': true }, function (tabs) {
      callback(undefined, tabs[0]);
    })
  });
}


export function onUpdated (callback) {
  chrome.tabs.onUpdated.addListener(callback)
  chrome.tabs.onActivated.addListener(callback)
}
