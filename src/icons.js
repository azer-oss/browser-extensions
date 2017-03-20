const login = require("./login")
const tabs = require("./tabs")
const api = require("./api")

module.exports = {
  update,
  set
}


function update () {
  tabs.current((error, url) => {
    if (error) throw error

    api.get('/api/like?url=' + escape(url), (_, response) => {
      set(!!(response && response.like))
    })
  })
}

function set (liked) {
  const path = "./images/heart-icon" + (liked ? "-liked" : "") + ".png";
  chrome.browserAction.setIcon({ path });
}
