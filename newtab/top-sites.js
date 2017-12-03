import Rows from "./rows"

export default class TopSites extends Rows {
  constructor(results, sort) {
    super(results, sort)
    this.title = 'Frequently Visited'
    this.name = 'top'
  }

  update(query) {
    if (query.length > 0) return this.add([])
    get(rows => this.add(addKozmos(rows.slice(0, 5))))
  }
}

function addKozmos (rows) {
  let i = rows.length
  while (i--) {
    if (rows[i].url.indexOf('getkozmos.com') > -1) {
      return rows
    }
  }

  rows[4] = {
    url: 'https://getkozmos.com',
    title: 'Kozmos'
  }

  return rows
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
