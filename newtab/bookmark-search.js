import Rows from "./rows"

export default class BookmarkSearch extends Rows {
  constructor(props) {
    super(props)
    this.name = 'bookmark-search'
    this.title = 'Liked in Kozmos'
  }

  update(query) {
    if (query.length == 0) return this.setState({
      rows: []
    })

    this.setState({
      loading: true
    })

    this.props.messages.send({ task: 'search-bookmarks', query }, resp => {
      this.setState({ loading: false })

      if (resp.error) return this.setState({
        error: resp.error
      })

      const rows = resp.content.results.likes

      this.setState({
        rows: rows
          .slice(0, this.max(rows.length))
          .map(row => this.mapEach(row))
      })
    })
  }
}
