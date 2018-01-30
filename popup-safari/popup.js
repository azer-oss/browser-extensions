import { h, Component, render } from "preact"
import tabs from "../safari/tabs"
import { setAsLiked, setAsNotLiked, setAsLoading } from "../safari/icons"
import Dialog from "./dialog"
import { Icon } from '../popup/icon';

class Popup extends Component {
  constructor(props) {
    super(props)
    window.Popover = this;

    this.updatePopover();
    safari.extension.globalPage.contentWindow.listenForPopover()
  }

  updatePopover() {
    this.setState({
      isLoggedIn: !!localStorage['token']
    })

    const tab = tabs.current();
    this.setState({
      url: tab.url,
      title: tab.title
    })

    this.onStartLoading();
    safari.extension.globalPage.contentWindow.getLike(tab.url)
      .then((resp) => {
        this.onStopLoading();
        if (resp) {
          this.setState({
            like: resp.like,
            isLiked: !!resp.like
          })
        } else {
          this.setState({
            like: null,
            isLiked: false
          })
        }
      });
  }

  resizePopover() {
    safari.self.height = document.body.clientHeight;
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
    if (this.state.isLiked) {
      setAsLiked();
    } else {
      setAsNotLiked();
    }
  }

  close() {
    safari.self.hide();
  }

  like() {
    if (!this.state.isLoggedIn) {
      tabs.create('https://getkozmos.com/login')
    }

    safari.extension.globalPage.contentWindow.like(this.state.url, this.state.title)
      .then((resp) => {
        if (resp.error) return this.setState({ error: resp.error })

        this.setState({
          like: resp.like,
          isLiked: !!resp.like,
          isJustLiked: true
        })

        this.updateActionIcon()
      })
  }

  unlike() {
    safari.extension.globalPage.contentWindow.unlike(this.state.url)
      .then((resp) => {
        if (resp.error) return this.setState({ error: resp.error })

        this.setState({
          like: null,
          isLiked: false
        })

        this.updateActionIcon()
      })
  }

  componentDidUpdate() {
    this.resizePopover();
  }

  render() {
    return (
      <div className="safari container">
        <h1>
          <a title="Open Kozmos" target="_blank" href="https://getkozmos.com" onclick={() => { tabs.create('https://getkozmos.com'); safari.self.hide(); }}>kozmos</a>
          <Icon name="external" onclick={() => { tabs.create('https://getkozmos.com'); safari.self.hide(); }} title="Open Your Bookmarks" />
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
