import { h, Component } from "preact"
import TaggingForm from "./tagging-form"
import Input from "./input"
import relativeDate from "relative-date"
import debounce from "debounce-fn"
import CollectionForm from "./collection-form"
import SpeedDial from "./speed-dial"
import tabs from "./tabs.json"
import Icon from "./icon"

export default class LikedDialog extends Component {
  constructor(props) {
    super(props)
    this.reset(props)
    this.updateTitle = debounce(this.props.updateTitle)
  }

  componentWillReceiveProps(props) {
    if (this.props.like.url !== props.like.url) {
      this.setState({
        isLoading: true,
        tags: []
      })
      this.load()
    }
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
        {this.state.isOnline
          ? this.renderOnlineBody()
          : this.renderOfflineBody()}
        <div className="footer">
          {this.renderLikedAgo()}
          <Icon
            name="trash"
            title="Delete this page from my bookmarks"
            onClick={this.props.unlike}
          />
        </div>
      </div>
    )
  }

  renderOfflineBody() {
    return (
      <div className="offline">
        <div className="desc">
          {this.renderLikedAgo()}
          <br />
          <br />
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
        <input
          className="title-textbox"
          value={
            this.props.title !== undefined
              ? this.props.title
              : this.props.like.title
          }
          onInput={e => this.updateTitle(e.target.value)}
        />
        {this.renderTabs()}
      </div>
    )
  }

  renderTabs() {
    const selected = this.props.selectedView
    let body = null

    if (selected === "tags") {
      body = (
        <TaggingForm
          like={this.props.like}
          onAddTag={this.props.onAddTag}
          onRemoveTag={this.props.onRemoveTag}
          onStartLoading={this.props.onStartLoading}
          onStopLoading={this.props.onStopLoading}
          onSync={this.props.onSync}
          onError={this.props.onError}
        />
      )
    } else if (selected === "collections") {
      body = (
        <CollectionForm like={this.props.like} onSave={this.props.onSave} />
      )
    } else {
      body = <SpeedDial like={this.props.like} onSave={this.props.onSave} />
    }

    return [
      <div className="tabs">
        {tabs.map(t => (
          <div
            className={`tab ${selected === t.key ? "selected" : ""}`}
            onClick={() => this.props.setView(t.key)}
          >
            {t.title}
          </div>
        ))}
      </div>,
      body
    ]
  }

  renderLikedAgo() {
    if (this.props.isSaved === false) {
      return <div className="liked-ago">Saving...</div>
    }

    if (this.props.isSaved === true) {
      return (
        <div className="liked-ago">
          Saved {relativeDate(this.props.savedAt)}.
        </div>
      )
    }

    return (
      <div className="liked-ago">
        Liked {relativeDate(this.props.like.createdAt)}.
      </div>
    )
  }
}
