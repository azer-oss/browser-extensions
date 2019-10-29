import Rows from "./rows"
import config from "../config"

export default class ListBookmarksByCollection extends Rows {
  constructor(results, sort) {
    super(results, sort)
    this.name = "bookmarks-by-collection"
    this.title = query => `Bookmarks in "${query.slice(3)} Collection"`
  }

  shouldBeOpen(query) {
    return query && query.indexOf("in:") === 0 && query.length > 3
  }

  async update(query) {
    const [collection, filter] = parseQuery(query || this.results.props.query)
    let results

    try {
      results = await this.getBookmarksByCollection(collection, filter)
    } catch (err) {
      this.fail(err)
    }

    this.add(results)
  }

  async getBookmarksByCollection(collection, filter) {
    return new Promise((resolve, reject) => {
      this.results.messages.send(
        {
          task: "get-bookmarks-by-collection",
          collection,
          offset: 0,
          limit: 5,
          filter
        },
        resp => {
          if (resp.error) return reject(resp.error)
          resolve(resp.content)
        }
      )
    })
  }

  async getLinkByUrl(url) {
    return new Promise((resolve, reject) => {
      this.results.messages.send({ task: "get-like", url }, resp => {
        if (resp.error) return reject(resp.error)
        resolve(resp.content.like)
      })
    })
  }
}

function parseQuery(query) {
  if (/^in:\"[\w\s]+\"$/.test(query)) {
    return [query.slice(4, -1).trim()]
  }

  if (/^in:\"[\w\s]+\" [\w\s]+$/.test(query)) {
    const closingQuoteAt = query.indexOf('" ', 4)
    const collection = query.slice(4, closingQuoteAt)
    const filter = query.slice(closingQuoteAt)
    return [collection.trim(), filter.trim()]
  }

  if (/^in:\w+ [\w\s]+$/.test(query)) {
    const separatingSpaceAt = query.indexOf(" ", 3)
    const collection = query.slice(3, separatingSpaceAt)
    const filter = query.slice(separatingSpaceAt)
    return [collection.trim(), filter.trim()]
  }

  return [query.slice(3).trim()]
}
