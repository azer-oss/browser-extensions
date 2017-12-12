import Rows from "./rows"

export default class RecentBookmarks extends Rows {
  constructor(results, sort) {
    super(results, sort)
    this.name = 'recent-bookmarks'
    this.title = 'Recently Liked in Kozmos'
  }

  shouldBeOpen(query) {
    return query.length == 0
  }

  fail(err) {
    console.error(err)
  }

  update(query) {
    this.results.messages.send({ task: 'get-recent-bookmarks', query }, resp => {
      if (resp.error) return this.fail(resp.error)

      this.add(resp.content.results.likes)
    })
  }
}
