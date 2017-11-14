import { h, Component, render } from "preact"
import tabs from "../chrome/tabs"
import Messaging from "./messaging"
import Icon from "./icon"
import Dialog from "./dialog"

class Popup extends Component {
  constructor(props) {
    super(props)

    this.messages = new Messaging()

    this.messages.send({ task: 'is-logged-in' }, resp => {
      this.setState({
        isLoggedIn: resp.content.isLoggedIn
      })
    })

    tabs.current((err, tab) => {
      if (err) return this.setState({ error: err })

      this.setState({
        url: tab.url,
        title: tab.title
      })

      this.messages.send({ task: 'get-like', url: tab.url }, resp => {
        this.setState({
          like: resp.content.like,
          isLiked: !!resp.content.like
        })
      })
    })
  }

  updateActionIcon() {
    const path = "./images/heart-icon" + (this.state.isLiked ? "-liked" : "") + ".png";
    const title = this.state.isLiked ? "Click to delete it from your likes" : "Click to add it to your likes"

    chrome.browserAction.setIcon({ path });
    chrome.browserAction.setTitle({ title });
  }

  close() {
    window.close()
  }

  like() {
    if (!this.state.isLoggedIn) {
      chrome.tabs.create({ url: 'azer.bike' })
    }

    this.messages.send({ task: 'like', url: this.state.url, title: this.state.title }, resp => {
      if (resp.content.error) return this.setState({ error: resp.content.error })

      this.setState({
        like: resp.content.like,
        isLiked: !!resp.content.like,
        isJustLiked: true
      })

      this.updateActionIcon()
    })
  }

  unlike() {
    this.messages.send({ task: 'unlike', url: this.state.url }, resp => {
      if (resp.content.error) return this.setState({ error: resp.content.error })

      this.setState({
        like: null,
        isLiked: false
      })

      this.updateActionIcon()
    })
  }

  render() {
    return (
      <div className="container">
        <h1>
          <a title="Open Kozmos" target="_blank" href="https://getkozmos.com">kozmos</a>
          <Icon name="external" onclick={() => chrome.tabs.create({ url: 'https://getkozmos.com' })} title="Open Your Bookmarks" />
        </h1>

        <Dialog isLiked={this.state.isLiked}
                record={this.state.like}
                isJustLiked={this.state.isJustLiked}
                isLoggedIn={this.state.isLoggedIn}
                unlike={() => this.unlike()}
                like={() => this.like()}
                />
      </div>
    )
  }
}

document.addEventListener("DOMContentLoaded", function() {
  render(<Popup />, document.body)
})
