import { h, Component } from "preact"
import Icon from "./icon"

export default class Tagbar extends Component {
  content() {
    if (!this.props.content || !this.props.content.length) return []

    const copy = this.props.content.slice()

    const occr = {}
    let i = copy.length
    while (i--) {
      occr[copy[i]] = occr[copy[i]] ? occr[copy[i]]+1 : 1
    }

    const uniques = Object.keys(occr)
    uniques.sort((a, b) => {
      if (occr[a] < occr[b]) return 1
      if (occr[a] > occr[b]) return -1
      return 0
    })

    return uniques
  }

  max() {
    return 10
  }

  render() {
    const content = this.content()
    if (content.length === 0) return

    return (
      <div className="tagbar">
        <Icon name="tag" stroke="3" />
        <div className="personal-tags">
          {content.slice(0, this.max()).map(t => this.renderTag(t))}
        </div>
      </div>
    )
  }

  renderTag(name) {
    const title = capitalize(name)

    return (
      <a className="tag button" onClick={() => this.props.openTag(name)} title={`Open "${title}" tag`}>
        {title}
      </a>
    )
  }
}

function capitalize (title) {
  return title.split(/\s+/).map(w => w.slice(0, 1).toUpperCase() + w.slice(1)).join(' ')
}
