import Rows from "./rows"

export default class ListBookmarksByTag extends Rows {
  constructor(results, sort) {
    super(results, sort)
    this.name = 'bookmarks-by-tag'
    this.title = query => `Tagged with ${query.slice(4)} On Kozmos`
  }

  update(query) {
    if (!query || query.indexOf('tag:') !== 0 || query.length < 5) return this.add([])

    const oquery = query || this.results.props.query

    this.results.messages.send({ task: 'search-bookmarks', query }, resp => {
      if (oquery !== this.results.props.query.trim()) {
        return
      }

      if (resp.error) return this.fail(resp.error)

      this.add(resp.content.results.likes)
    })
  }
}
