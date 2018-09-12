import Rows from "./rows"
import debounce from "debounce-fn"
import config from "../config"

const OFFLINE_RESULTS_THRESHOLD = 4

export default class Autocomplete extends Rows {
  constructor(results, sort) {
    super(results, sort)
    this.name = "autocomplete-bookmarks"
    this.title = "Bookmarks"
    this.showMoreButton = true
    this.update = debounce(this.fetch.bind(this), 150)
  }

  shouldBeOpen(query) {
    return query.length > 0 && query.indexOf("tag:") === -1
  }

  fetch(query) {
    const oquery = query || this.results.props.query
    const addedAlready = {}

    this.results.messages.send({ task: "autocomplete", query }, resp => {
      if (oquery !== this.results.props.query.trim()) {
        return
      }

      if (resp.error) return this.fail(resp.error)

      resp.content.forEach(row => (addedAlready[row.url] = true))

      this.add(
        this.addMoreButton(resp.content, {
          title: `More results for "${oquery}"`,
          url: `${config.host}/search?q=${oquery}`
        })
      )

      if (resp.content.length >= OFFLINE_RESULTS_THRESHOLD) {
        return
      }

      this.results.messages.send({ task: "search-bookmarks", query }, resp => {
        if (oquery !== this.results.props.query.trim()) {
          return
        }

        if (resp.error) return this.fail(resp.error)

        const content = resp.content.filter(row => !addedAlready[row.url])

        this.add(
          this.addMoreButton(content, {
            title: `More results for "${oquery}"`,
            url: `${config.host}/search?q=${oquery}`
          })
        )
      })
    })
  }
}
