import { h, Component } from "preact"
import img from "img"
import { clean as cleanURL } from "urls"
import * as titles from "./titles"
import URLImage from './url-image'

export default class URLIcon extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.content.url !== nextProps.content.url ||
      this.props.selected !== nextProps.selected ||
      this.props.type !== nextProps.type
  }

  select() {
    this.props.onSelect(this.props.content)
  }

  render() {
    return (
      <a id={this.props.content.id} className={`urlicon ${this.props.selected ? "selected" : ""}`} href={this.url()} title={`${this.title()} - ${cleanURL(this.props.content.url)}`} onMouseMove={() => this.select()}>
        <URLImage content={this.props.content} icon-only />
        <div className="title">
          {this.title()}
        </div>
        <div className="url">
          {this.prettyURL()}
        </div>
        <div className="clear"></div>
      </a>
    )
  }

  title() {
    if (this.props.content.type === 'search-query') {
      return this.props.content.title
    }

    if (this.props.content.type === 'url-query') {
      return `Open ${cleanURL(this.props.content.url)}`
    }

    if (titles.isValid(this.props.content.title)) {
      return titles.normalize(this.props.content.title)
    }

    return titles.generateFromURL(this.props.content.url)
  }

  url() {
    if (/^https?:\/\//.test(this.props.content.url)) {
      return this.props.content.url
    }

    return 'http://' + this.props.content.url
  }

  prettyURL() {
    return cleanURL(this.url())
  }
}
