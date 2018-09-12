import URLIcon from "./url-icon"
import config from "../config"

const MORE_RESULTS_THRESHOLD = 4

export default class Rows {
  constructor(results, sort) {
    this.results = results
    this.sort = sort
  }

  add(rows) {
    this.results.addRows(this, rows)
  }

  addMoreButton(rows, { title, url }) {
    const alreadyAddedCount = this.results.count(
      row => row.category.name === this.name && !row.isMoreButton
    )
    const limit = MORE_RESULTS_THRESHOLD - alreadyAddedCount

    if (rows.length > limit) {
      rows = rows.slice(0, limit)
    }

    this.results.removeRows(
      row => row.category.name !== this.name || !row.isMoreButton
    )

    rows.push({
      isMoreButton: true,
      url: url || config.host,
      title: title || "More results"
    })

    return rows
  }

  fail(error) {
    console.error("Error %s: ", this.name, error)
  }

  onNewQuery(query) {
    this.latestQuery = query

    if (this.shouldBeOpen(query)) {
      this.update(query)
    }
  }
}
