import { clean as cleanURL } from "urls"

export default class Row {
  constructor(category, { title, desc, tags, url, isMoreButton }) {
    this.category = category
    this.title = title
    this.desc = desc
    this.url = url
    this.isMoreButton = isMoreButton
    this.tags = tags
  }

  key() {
    return this.url
  }

  onClick() {
    let url = this.url

    if (!/^https?:\/\//.test(url)) {
      url = "http://" + url
    }

    document.location.href = url
  }

  onPressEnter() {
    this.onClick()
  }

  renderTitle() {
    return this.title
  }

  renderDesc() {
    return this.desc || cleanURL(this.url)
  }

  renderFirstLetter() {
    if (!this.url) {
      return this.title.slice(0, 1).toUpperCase()
    }

    return findHostname(this.url)
      .slice(0, 1)
      .toUpperCase()
  }
}

export function findHostname(url) {
  return url
    .replace(/^\w+:\/\//, "")
    .split("/")[0]
    .replace(/^www\./, "")
}
