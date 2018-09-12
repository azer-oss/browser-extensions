import Rows from "./rows"
import debounce from "debounce-fn"
import { clean } from "urls"

export default class AutocompleteTopSites extends Rows {
  constructor(results, sort) {
    super(results, sort)
    this.name = "autocomplete-top-sites"
    this.title = "Frequently Visited"
    this.update = debounce(this.fetch.bind(this), 150)
  }

  shouldBeOpen(query) {
    return query.length > 0
  }

  fetch(query) {
    const result = []

    chrome.topSites.get(topSites => {
      let i = -1
      const len = topSites.length
      while (++i < len) {
        if (
          clean(topSites[i].url).indexOf(query) === 0 ||
          topSites[i].title.toLowerCase().indexOf(query) > -1
        ) {
          result.push(topSites[i])
        }
      }

      this.add(result)
    })
  }
}
