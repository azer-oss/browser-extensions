import Rows from "./rows"
import { clean } from 'urls'

export default class TopSites extends Rows {
  constructor(results, sort) {
    super(results, sort)
    this.title = 'Frequently Visited'
    this.name = 'top'
  }

  shouldBeOpen(query) {
    return query.length < 5
  }

  update(query) {
    if (!query) {
      return this.all()
    } else {
      return this.filterByQuery(query)
    }
  }

  all() {
    get(rows => this.add(addKozmos(rows.slice(0, 5))))
  }

  filterByQuery(query) {
    const result = []

    chrome.topSites.get(topSites => {
      let i = -1
      const len = topSites.length
      while (++i < len) {
        if (clean(topSites[i].url).indexOf(query) === 0 || topSites[i].title.toLowerCase().indexOf(query) === 0) {
          result.push(topSites[i])
        }
      }

      this.add(result)
    })
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
  let list = {
    'https://google.com/': true,
    'http://google.com/': true
  }

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
