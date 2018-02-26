import { h, Component } from "preact"
import TaggingForm from "./tagging-form"
import relativeDate from "relative-date"
import Icon from "./icon"

export default class LikedDialog extends Component {
  constructor(props) {
    super(props)
    this.reset(props)
  }

  reset(props) {
    this.setState({
      isOnline: navigator.onLine,
      isJustLiked: props.isJustLiked,
      like: props.like
    })
  }

  render() {
    return (
      <div className="dialog">
        {this.props.isJustLiked ? <h2>Done.</h2> : null}
        { this.state.isOnline ? this.renderOnlineBody() : this.renderOfflineBody()}
        <div className="footer">
          <Icon name="trash" title="Unlike This Page" onClick={() => this.props.unlike()} />
        </div>
      </div>
    )
  }

  renderOfflineBody() {
    return (
      <div className="offline">
        <div className="desc">
          {this.renderLikedAgo()}
          <br /><br />
          You're currently offline but it's ok.
          <br />
          The changes will sync when you connect.
        </div>
      </div>
    )
  }

  renderOnlineBody() {
    return (
      <div className="online">
        <div className="desc">
          {this.props.isJustLiked ? "You can add some tags, too:" :  this.renderLikedAgo()}
        </div>
        <TaggingForm like={this.props.like}
                     onAddTag={this.props.onAddTag}
                     onRemoveTag={this.props.onRemoveTag}
                     onStartLoading={this.props.onStartLoading}
                     onStopLoading={this.props.onStopLoading}
                     onSync={this.props.onSync}
                     onError={this.props.onError}
                     />
      </div>
    )
  }

  renderLikedAgo() {
    return (
      <div className="liked-ago">
        You liked this page {relativeDate(this.props.like.likedAt)}.
      </div>
    )
  }
}
