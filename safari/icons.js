const debounce = require("debounce-fn")
const api = require("../lib/api")
const likes = require("../lib/likes")
const tabs = require("./tabs")

const _onCurrentURLUpdated = debounce(onCurrentURLUpdated, 200)

module.exports = {
  listenForChanges,
  setAsLiked,
  setAsNotLiked,
  onCurrentURLUpdated: _onCurrentURLUpdated
}

function listenForChanges() {
  tabs.onUpdated(_onCurrentURLUpdated)
}

function onCurrentURLUpdated(event) {
  setAsLoading()

  likes.isLiked(tabs.current().url, function (liked) {
    if (liked) {
      setAsLiked()
    } else {
      setAsNotLiked()
    }
  })
}

function setAsLiked () {
  setIcon(safari.extension.baseURI + 'images/heart-icon-liked.png')
  setTooltip("Unlike this page")
}

function setAsNotLiked() {
  setIcon(safari.extension.baseURI + 'images/heart-icon.png')
  setTooltip("Like This Page")
}

function setAsLoading() {
  setIcon(safari.extension.baseURI + 'images/heart-icon-loading.png')
  setTooltip("Connecting to Kozmos...")
}

function setIcon (src) {
  safari.extension.toolbarItems[0].image = src
}

function setTooltip (text) {
  safari.extension.toolbarItems[0].toolTip = text
}
