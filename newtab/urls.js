import { h, Component } from "preact"
import URLIcon from "./url-icon"

const MAX_ITEMS = 5

export default class URLs extends Component {
  render () {
    if (!this.props.content || this.props.content.length === 0) return

    const name = this.props.title.toLowerCase().replace(/[^\w]+/, ' ').trim().replace(/\s+/, '-')

    return (
      <div className={`urls ${name}`}>
        <h1>{this.props.title}</h1>
        <div className="urls-content">
          {this.props.content.slice(0, MAX_ITEMS).map((url) => this.renderRow(url))}
        </div>
        <div className="clear"></div>
      </div>
    )
  }

  renderRow(row) {
    return (
      <URLIcon content={row} onSelect={this.props.onSelect} type={this.props.type} selected={this.props.selected && row.url === this.props.selected.url} />
    )
  }
}
