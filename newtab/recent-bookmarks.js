import Rows from "./rows"

export default class RecentBookmarks extends Rows {
  constructor(results, sort) {
    super(results, sort)
    this.name = 'recent-bookmarks'
    this.title = 'Recently Liked in Kozmos'
  }

  update(query) {
    if (query.length > 0) return this.add([])

    this.results.messages.send({ task: 'get-recent-bookmarks', query }, resp => {
      if (resp.error) return this.fail(resp.error)

      this.add(resp.content.results.likes)
    })
  }
}
