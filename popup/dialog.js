import { h, Component } from "preact"
import Button from "./button"
import Icon from "./icon"
import TaggingForm from "./tagging-form"
import relativeDate from "relative-date"

export default class Dialog extends Component {
  render() {
    if (this.props.isLiked) {
      return this.renderLiked()
    } else if (this.props.isLoggedIn) {
      return this.renderLike()
    } else {
      return this.renderLogin()
    }
  }

  renderLogin() {
    return (
      <div className="dialog">
        login first
      </div>
    )
  }

  renderLiked() {
    const online = navigator.onLine

    return (
      <div className="dialog">
        {this.props.isJustLiked ? <h2>Done.</h2> : null}
        <div className="desc">
          {this.props.isJustLiked ? online ? "You can add some tags, too:" : "You're currently offline. These changes will be sent to Kozmos when you connect to internet." : `You liked this page ${relativeDate(this.props.record.likedAt)}.`}
        </div>
        { online ? <TaggingForm like={this.props.record} onAddTag={this.props.onAddTag} onRemoveTag={this.props.onRemoveTag} /> : null}
        <div className="footer">
          <Icon name="trash" title="Delete It" onClick={this.props.unlike} />
        </div>
      </div>
    )
  }

  renderLike() {
    return (
      <div className="dialog">
        <div className="desc">
          You haven't liked this page yet.
        </div>
        <Button title="Click to add this page to your likes" icon="heart" onClick={() => this.props.like()}>Like It</Button>
      </div>
    )
  }
}
