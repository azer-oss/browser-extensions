const debounce = require("debounce-fn")
const api = require("../lib/api")
const likes = require("../lib/likes")
const tabs = require("./tabs")
import icons from "./icons"

const _onCurrentURLUpdated = debounce(onCurrentURLUpdated, 200)

module.exports = {
    listenForChanges,
    onCurrentURLUpdated: _onCurrentURLUpdated
}

function listenForChanges() {
    tabs.onUpdated(_onCurrentURLUpdated)
}

function onCurrentURLUpdated(event) {
    icons.setAsLoading()

    likes.isLiked(tabs.current().url, function (liked) {
        if (liked) {
            icons.setAsLiked()
        } else {
            icons.setAsNotLiked()
        }
    })
}
