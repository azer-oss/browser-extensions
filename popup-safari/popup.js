import { h, Component, render } from "preact"
import tabs from "../safari/tabs"
import Messaging from "./messaging"
import { setAsLiked, setAsNotLiked, setAsLoading } from "../safari/icons"
import Dialog from "./dialog"

class Popup extends Component {
  constructor(props) {
    super(props)

    this.messages = new Messaging()

    this.setState({
      isLoggedIn: !!localStorage['token']
    })

    const tab = tabs.current();

    this.setState({
      url: tab.url,
      title: tab.title
    })

    safari.extension.global.contentWindow.getLike(tab.url)
      .then((resp) => {
        this.setState({
          like: resp.like,
          isLiked: !!resp.like
        })

        if (!this.state.isLiked) {
          this.like()
        }
      });
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
          onStartLoading={() => this.onStartLoading()}
          onStopLoading={() => this.onStopLoading()}
          onSync={() => this.onSync()}
          onError={err => this.onError(err)}
        />

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
        <a href={'mailto:azer@getkozmos.com?subject=Extension+Error&body=Stack trace:' + encodeURI(this.state.error.stack)}>
          <Icon name="alert" title="An error occurred. Click here to report it." onclick={() => this.reportError()} stroke="2" />
        </a>
      )
    }
  }

}

document.addEventListener("DOMContentLoaded", function () {
  render(<Popup />, document.body)
})
