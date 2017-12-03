import { h, Component } from "preact"
import Button from "./button"
import LikedDialog from "./liked-dialog"
import Input from "./input"
import Settings from "../newtab/settings"

export default class Dialog extends Component {
  search(value) {
    chrome.tabs.create({ url: 'https://getkozmos.com/search?q=' + encodeURI(value) })
  }

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
      <div className="dialog login">
        <div className="desc">
          Looks like you haven't logged in yet.

        </div>
        <Button title="Login Kozmos" onClick={() => chrome.tabs.create({ url: 'https://getkozmos.com/login' })}>
          Login
        </Button>
      </div>
    )
  }

  renderLiked() {
    return (
      <LikedDialog isJustLiked={this.state.isJustLiked}
                   like={this.props.record}
                   unlike={this.props.unlike}
                   onStartLoading={this.props.onStartLoading}
                   onStopLoading={this.props.onStopLoading}
                   onSync={this.props.onSync}
                   onError={this.props.onError}
                   />
    )
  }

  renderLike() {
    return (
      <div className="dialog like">
        <Input onPressEnter={value => this.search(value)} icon="search" placeholder="Search Your Bookmarks" iconStroke="3" />
        <div className="desc">
          You haven't liked this page yet.
        </div>
        <Button title="Click to add this page to your likes" icon="heart" onClick={() => this.props.like()}>Like It</Button>
      </div>
    )
  }
}
