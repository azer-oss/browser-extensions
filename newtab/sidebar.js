import { h, Component } from "preact"
import { clean as cleanURL } from "urls"
import relativeDate from "relative-date"
import Icon from "./icon"
import URLImage from "./url-image"
import { hide as hideTopSite } from './top-sites'

export default class Sidebar extends Component {
  componentWillReceiveProps(props) {
    if (!props.selected) return
    props.messages.send({ task: 'get-like', url: props.selected.url }, resp => {
      this.setState({
        like: resp.content.like
      })
    })
  }

  deleteTopSite() {
    hideTopSite(this.props.selected.url)
    this.props.updateFn()
  }

  toggleLike() {
    if (this.state.like) this.unlike()
    else this.like()
  }

  like() {
    this.props.messages.send({ task: 'like', url: this.props.selected.url }, resp => {
      this.setState({
        like: resp.content.like
      })
    })
  }

  unlike() {
    this.props.messages.send({ task: 'unlike', url: this.props.selected.url }, resp => {
      this.setState({
        like: null
      })
    })
  }

  render() {
    if (!this.props.selected) return

    return (
      <div className="sidebar">
        <div className="image">
          <a className="link" href={this.props.selected.url}>
            <URLImage content={this.props.selected} />
            <h1>{this.props.selected.title}</h1>
            <h2>{cleanURL(this.props.selected.url)}</h2>
          </a>
          {this.renderButtons()}
        </div>
      </div>
    )
  }

  renderButtons() {
    return (
      <div className="buttons">
        {this.renderLikeButton()}
        {this.props.selected.type === 'top' ? this.renderDeleteTopSiteButton() : null}
      </div>
    )
  }

  renderLikeButton() {
    const ago = this.state.like ? relativeDate(this.state.like.likedAt) : ""
    const title = this.state.like ? "Delete It From Your Likes" : "Add It To Your Likes"

    return (
      <div title={title} className={`button like-button ${this.state.like? "liked" : ""}`} onClick={() => this.toggleLike()}>
        <Icon name="heart" />
        {this.state.like ? `Liked ${ago}` : "Like It"}
      </div>
    )
  }

  renderDeleteTopSiteButton() {
    return (
      <div title="Delete It From Frequently Visited" className="button delete-button" onClick={() => this.deleteTopSite()}>
        <Icon name="trash" />
        Delete It
      </div>
    )
  }

}
