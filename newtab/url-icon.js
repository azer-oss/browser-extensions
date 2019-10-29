import { h, Component } from "preact"
import img from "img"
import * as titles from "./titles"
import URLImage from "./url-image"

export default class URLIcon extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      this.props.content.url !== nextProps.content.url ||
      this.props.selected !== nextProps.selected ||
      this.props.type !== nextProps.type
    )
  }

  select() {
    this.props.onSelect(this.props.index)
  }

  render() {
    /*const linkTitle = this.props.content.url
      ? `${this.title()} - ${cleanURL(this.props.content.url)}`
      : this.title()*/

    return (
      <div
        id={this.props.content.id}
        className={`urlicon ${this.props.selected ? "selected" : ""}`}
        onClick={() => this.props.content.onClick()}
        title={this.props.content.renderTitle()}
        onMouseMove={() => this.select()}
      >
        <URLImage content={this.props.content} icon-only />
        <div className="title">{this.props.content.renderTitle()}</div>
        <div className="url">{this.props.content.renderDesc()}</div>
        <div className="clear" />
      </div>
    )
  }

  /*title() {
    if (this.props.content.type === "search-query") {
      return this.props.content.title
    }

    if (this.props.content.type === "url-query") {
      return `Open ${cleanURL(this.props.content.url)}`
    }

    if (this.props.content.type === "collections") {
      return this.props.content.title
    }

    if (this.props.content.title && titles.isValid(this.props.content.title)) {
      return titles.normalize(this.props.content.title)
    }

    return titles.generateFromURL(this.props.content.url)
  }*/
}
