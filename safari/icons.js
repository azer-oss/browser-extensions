module.exports = {
  setAsLiked,
  setAsNotLiked,
  setAsLoading
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
  safari.extension.toolbarItems.forEach(function (toolbar) {
    toolbar.image = src
  })
}

function setTooltip (text) {
  safari.extension.toolbarItems.forEach(function (toolbar) {
    toolbar.toolTip = text
  })
}
