import Rows from "./rows"

export default class OpenWebsite extends Rows {
  constructor(results, sort) {
    super(results, sort)
    this.name = 'open-website'
    this.pinned = true
    this.title = ''
  }

  shouldBeOpen(query) {
    return query && query.length > 1 && /^[\w\.]+$/i.test(query)
  }

  fail(error) {
    console.error(error)
  }

  update(query) {
    const oquery = query || this.results.props.query

    this.results.messages.send({ task: 'get-website', query }, resp => {
      if (oquery !== this.results.props.query.trim()) {
        return
      }

      if (resp.error) return this.fail(resp.error)

      this.add(resp.content.results.likes.slice(0, 1))
    })
  }
}
