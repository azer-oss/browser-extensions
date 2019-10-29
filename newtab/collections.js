import Rows from "./rows"
import CollectionRow from "./collection-row"

export default class Collections extends Rows {
  constructor(results, sort) {
    super(results, sort)
    this.name = "collections"
    this.title = "Collections"
  }

  add(rows) {
    this.results.addRows(this, rows.map(r => new CollectionRow(this, r)))
  }

  shouldBeOpen(query) {
    return !query.trim().startsWith("tag:") && !/^in:.+/.test(query.trim())
  }

  fail(err) {
    console.error(err)
  }

  update(query) {
    this.results.messages.send({ task: "get-collections", query }, resp => {
      if (resp.error) return this.fail(resp.error)

      if (query.length === 0 || query.trim() === "in:") {
        this.add(resp.content)
        return
      }

      this.add(
        resp.content.filter(c =>
          c.title.toLowerCase().includes(query.toLowerCase())
        )
      )
    })
  }
}
