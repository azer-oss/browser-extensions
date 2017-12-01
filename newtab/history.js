import Rows from "./rows"
import { findHostname } from './url-image'

export default class History extends Rows {
  constructor(props) {
    super(props)
    this.name = 'history'
    this.title = 'Previously Visited'
  }

  update(query) {
    if (query.length === 0) return this.setState({ rows: [] })

    this.setState({
      loading: true
    })

    chrome.history.search({ text: query }, history => {
      const rows = history.filter(filterOutSearch)

      this.setState({
        loading: false,
        rows: rows
          .slice(0, this.max(rows.length))
          .map(row => this.mapEach(row))
      })
    })
  }
}

function filterOutSearch (row) {
  return findHostname(row.url).split('.')[0] !== 'google'
    && !/search\/?\?q\=\w*/.test(row.url)
}
