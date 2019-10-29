import Rows from "./rows"
import config from "../config"

export default class ListSpeedDial extends Rows {
  constructor(results, sort) {
    super(results, sort)
    this.name = "speed-dial"
    this.title = query => `Speed Dial`
  }

  shouldBeOpen(query) {
    return (
      query.length > 0 && !query.startsWith("in:") && !query.startsWith("tag:")
    )
  }

  async update(query) {
    const speeddial = await this.getSpeedDialByKey(query)

    if (speeddial) {
      this.add([speeddial])
    }
  }

  async getSpeedDialByKey(key) {
    return new Promise((resolve, reject) => {
      this.results.messages.send(
        {
          task: "get-speed-dial",
          key
        },
        resp => {
          if (resp.error) return reject(resp.error)
          resolve(resp.content.speeddial)
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
