import icons from "./icons"
import user from "./user"
import tabs from "./tabs"
import config from "../config"
import likes from "../lib/likes"

export function init () {
  icons.listenForChanges()
  chrome.browserAction.onClicked.addListener(onClick)
}

function onClick (tab) {
  user.auth(error => {
    if (error) {
      return tabs.create(config.host + '/login?from=extension&like=' + escape(tab.url));
    }

    likes.isLiked(tab.url, liked => {
      likes[liked ? "unlike" : "like"](tab.url, err => {
        if (err) return console.error(err)
        icons.set(!liked)
      })
    })
  })
}
