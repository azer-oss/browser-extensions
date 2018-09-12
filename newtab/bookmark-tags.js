import Rows from "./rows"
import config from "../config"

export default class ListBookmarksByTag extends Rows {
  constructor(results, sort) {
    super(results, sort)
    this.name = "bookmarks-by-tag"
    this.title = query => `Bookmarks Tagged With "${query.slice(4)}"`
  }

  shouldBeOpen(query) {
    return query && query.indexOf("tag:") === 0 && query.length > 4
  }

  update(query) {
    const oquery = query || this.results.props.query
    const tag = oquery.slice(4)

    this.results.messages.send({ task: "get-bookmarks-by-tag", tag }, resp => {
      if (oquery !== this.results.props.query.trim()) {
        return
      }

      if (resp.error) return this.fail(resp.error)

      const content =
        resp.content.length > 4
          ? this.addMoreButton(resp.content, {
              title: `More tagged with "${tag}"`,
              url: `${config.host}/tag/${tag}`
            })
          : content

      this.add(content)
    })
  }
}
