import { h } from "preact"
import Rows from "./rows"
import titleFromURL from "title-from-url"

export default class QuerySuggestions extends Rows {
  constructor(props) {
    super(props)
    this.type = 'query-suggestions'
  }

  createURLSuggestions(query) {
    if (!isURL(query)) return []

    const url = /\w+:\/\//.test(query) ? query : 'http://' + query

    return [{
      title: `Open "${titleFromURL(query)}"`,
      type: 'query-suggestion',
      url
    }]
  }

  createSearchSuggestions(query) {
    if (isURL(query)) return []

    return [
      {
        url: 'https://google.com/search?q=' + encodeURI(query),
        query: query,
        title: `Search "${query}" on Google`,
        type: 'search-query'
      },
      {
        url: 'https://getkozmos.com/search?q=' + encodeURI(query),
        query: query,
        title: `Search "${query}" on Kozmos`,
        type: 'search-query'
      }
    ]
  }

  update(query) {
    if (query.length === 0) return this.setState({ rows: [] })

    const rows = this.createURLSuggestions(query)
      .concat(this.createSearchSuggestions(query))
      .map(row => this.mapEach(row))

    this.setState({
      rows: rows.slice(0, this.max(rows.length))
    })
  }
}

function isURL (query) {
  return query.trim().indexOf('.') > 0 && query.indexOf(' ') === -1
}
