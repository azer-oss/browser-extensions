import Rows from "./rows"
import { findHostname } from "./url-image"

export default class History extends Rows {
  constructor(results, sort) {
    super(results, sort)
    this.name = "history"
    this.title = "History"
  }

  shouldBeOpen(query) {
    return query.length > 1 && query.trim().length > 1
  }

  update(query) {
    chrome.history.search({ text: query }, history => {
      this.add(history.filter(filterOutSearch))
    })
  }
}

function filterOutSearch(row) {
  return (
    findHostname(row.url).split(".")[0] !== "google" &&
    !/search\/?\?q\=\w*/.test(row.url) &&
    !/facebook\.com\/search/.test(row.url) &&
    !/twitter\.com\/search/.test(row.url) &&
    findHostname(row.url) !== "t.co"
  )
}
