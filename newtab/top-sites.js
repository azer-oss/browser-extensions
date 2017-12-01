import { h } from "preact"
import Rows from "./rows"

export default class TopSites extends Rows {
  constructor(props) {
    super(props)
    this.title = 'Frequently Visited'
    this.name = 'top'
  }

  update(query) {
    if (query.length > 0) return this.setState({
      rows: []
    })

    get(rows => {
      this.setState({
        rows: rows.slice(0, this.max(rows.length)).map(r => this.mapEach(r))
      })
    })
  }
}

export function get (callback) {
  chrome.topSites.get(topSites => {
    callback(filter(topSites))
  })
}

export function hide (url) {
  let hidden = getHiddenTopSites()
  hidden[url] = true
  setHiddenTopSites(hidden)
}

function getHiddenTopSites () {
  let list = {}
  try {
    list = JSON.parse(localStorage['hidden-toplist'])
  } catch (err) {
    setHiddenTopSites(list)
  }

  return list
}

function setHiddenTopSites(list) {
  localStorage['hidden-toplist'] = JSON.stringify(list)
}

function filter(topSites) {
  const hide = getHiddenTopSites()
  return topSites.filter(row => !hide[row.url])
}
