import URLIcon from "./url-icon"

export default class Rows {
  constructor(results, sort) {
    this.results = results
    this.sort = sort
  }

  add(rows) {
    this.results.addRows(this, rows)
  }
}
