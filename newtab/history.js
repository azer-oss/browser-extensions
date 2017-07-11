import URLs from "./urls"

export default class History extends URLs {
  constructor(props) {
    super(props)
    this.name = 'history'
  }

  recent(callback) {
    return this.top(callback)
  }

  top(callback) {
    chrome.topSites.get(result => callback(undefined, result))
  }

  filter(query, callback) {
    chrome.history.search({ text: query.trim() }, result => callback(undefined, result))
  }
}
