import { h, Component, render } from "preact"
import tabs from "../chrome/tabs"
import Messaging from "./messaging"
import Icon from "./icon"
import Dialog from "./dialog"
import Settings from "./settings"

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

        this.messages.send({ task: 'get-settings-value', key: "oneClickLike" }, resp => {
          if (resp.error) return this.onError(resp.error)

          if (!this.state.isLiked && resp.content.value) {
            this.like()
          }
        })
      })
    })
  }

  onStartLoading() {
    this.setState({
      isLoading: true
    })
  }

  onStopLoading() {
    setTimeout(() => {
      this.setState({
        isLoading: false
      })
    }, 500)
  }

  onError(error) {
    const e401 = error.message.indexOf('401') > -1
    if (e401) {
      return this.setState({
        isLoggedIn: false,
        isLiked: false
      })
    }

    this.setState({
      error
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
      chrome.tabs.create({ url: 'https://getkozmos.com/login' })
    }

    this.messages.send({ task: 'like', url: this.state.url, title: this.state.title }, resp => {
      if (resp.content.error) return this.onError(resp.content.error)

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
      if (resp.content.error) return this.onError(resp.content.error)

      this.setState({
        like: null,
        isLiked: false
      })

      this.updateActionIcon()
    })
  }

  render() {
    if (this.state.settings) return this.renderSettings()

    return (
      <div className="container">
        <h1>
          <a title="Open Kozmos" target="_blank" href="https://getkozmos.com">kozmos</a>
          <Icon name="settings" onClick={() => this.setState({ settings: true })} title="Settings" />
        </h1>

        <Dialog isLiked={this.state.isLiked}
                record={this.state.like}
                isJustLiked={this.state.isJustLiked}
                isLoggedIn={this.state.isLoggedIn}
                unlike={() => this.unlike()}
                like={() => this.like()}
                onStartLoading={() => this.onStartLoading()}
                onStopLoading={() => this.onStopLoading()}
                onSync={() => this.onSync()}
                onError={err => this.onError(err)}
          />

          {this.renderStatus()}
      </div>
    )
  }

  renderSettings() {
    return (
      <div className="container">
        <h1>
          <a title="Open Kozmos" target="_blank" href="https://getkozmos.com">kozmos</a>
          <Icon stroke="3" name="close" onClick={() => this.setState({ settings: false })} title="Close Settings" />
        </h1>
        <Settings type="popup" messages={this.messages} onError={err => this.onError(err)} />
        {this.renderStatus()}
      </div>
    )
  }


  renderStatus() {
    return (
      <div className="status">
        {this.renderStatusIcon()}
      </div>
    )
  }

  renderStatusIcon() {
    if (this.state.isLoading) {
      return <Icon name="clock" title="Connecting to Kozmos right now" />
    }

    if (this.state.error) {
      return (
        <Icon name="alert" title="An error occurred. Click here to report it." onClick={() => this.reportError()} stroke="2" />
      )
    }
  }

  reportError() {
    return window.open('mailto:azer@getkozmos.com?subject=Extension+Error&body=' + encodeURI(`Message: ${this.state.error.message} Stack: ${this.state.error.stack}`))
  }

}

document.addEventListener("DOMContentLoaded", function() {
  render(<Popup />, document.body)
})
