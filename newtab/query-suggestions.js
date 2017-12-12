import Rows from "./rows"
import titleFromURL from "title-from-url"

export default class QuerySuggestions extends Rows {
  constructor(results, sort) {
    super(results, sort)
    this.name = 'query-suggestions'
    this.pinned = true
  }

  shouldBeOpen(query) {
    return query.length > 1 && query.trim().length > 1
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
    if (query.indexOf('tag:') === 0 && query.length > 4) return [{
      url: 'https://getkozmos.com/tag/' + encodeURI(query.slice(4)),
      query: query,
      title: `Open "${query.slice(4)}" tag in Kozmos`,
      type: 'search-query'
    }]

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
    this.add(this.createURLSuggestions(query).concat(this.createSearchSuggestions(query)))
  }
}

function isURL (query) {
  return query.trim().indexOf('.') > 0 && query.indexOf(' ') === -1
}
