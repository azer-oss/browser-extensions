import { h, Component } from "preact"
import Content from "./content"
import Messaging from "./messaging"
import SearchInput from "./search-input"
import debounce from "debounce-fn"

export default class Search extends Component {
  constructor(props) {
    super(props)
    this.messages = new Messaging()
    this.searchBookmarks = debounce(this._searchBookmarks.bind(this), 600)

    this.setState({
      query: '',
      likes: [],
      topSites: []
    })

    chrome.topSites.get(topSites => this.setState({ topSites: topSites.slice(0, 5) }))
    this.getRecentBookmarks((err, likes) => this.setState({ likes }))
  }

  getRecentBookmarks(callback) {
    this.messages.send({ task: 'get-recent-bookmarks' }, resp => {
      if (resp.error) return callback(new Error(resp.error))
      callback(undefined, resp.media.concat(resp.non_media).sort(sortLikes).slice(0, 5))
    })
  }

  _searchBookmarks(query, callback) {
    this.messages.send({ task: 'search-bookmarks', query }, resp => {
      if (resp.content.query !== this.state.query) return
      if (resp.error) return callback(new Error(resp.error))
      callback(undefined, resp.content)
    })
  }

  onQueryChange(query) {
    if (query === this.state.query) return

    if (query.length == 0) {
      return this.setState({
        loading: false,
        likes: [],
        query: ""
      })
    }

    if (query === this.state.query.trim()) return

    this.setState({
      loading: true,
      likes: [],
      history: [],
      query
    })

    this.searchBookmarks(query.trim(), (error, result) => {
      if (error) return this.setState({ error })

      this.setState({
        likes: result.media.concat(result.non_media).sort(sortLikes),
        loading: false
      })
    })

    chrome.history.search({ text: query.trim() }, history => {
      this.setState({
        history
      })
    })
  }

  render() {
    return (
      <Content wallpaper={this.props.wallpaper}>
        <div className="bookmarks">
          <SearchInput query={this.state.query} onQueryChange={query => this.onQueryChange(query)} />
          {this.renderTopSites()}
          {this.renderHistory()}
          {this.renderLikes()}
          {this.renderLoading()}
          {this.renderNoResults()}
        </div>
      </Content>
    )
  }

  renderTopSites() {
    if (this.state.query) return

    return (
      <div className="top-sites urls">
        {this.state.topSites.map(site => <URLIcon {...site} />)}
        <div className="clear"></div>
      </div>
    )
  }

  renderHistory() {
    if (!this.state.history || this.state.history.length === 0) return

    return (
      <div className="history urls">
        {this.state.history.slice(0, 5).map(url => <URLIcon {...url} />)}
        <div className="clear"></div>
      </div>
    )
  }

  renderLikes() {
    return (
      <div className="search-likes urls">
        {this.state.likes.length > 10 ? this.renderMoreResultsLink() : null}
        {this.state.likes.slice(0, 5).map(like => <URLIcon {...like} />)}
        <div className="clear"></div>
      </div>
    )
  }

  renderMoreResultsLink() {
    return (
      <a className="more-results-button" href={`https://getkozmos.com/search?query=${this.state.query}`}>
        See More Results
      </a>
    )
  }

  renderLoading() {
    const query = this.state.query.trim()
    if (!this.state.loading || query == "") return

    return (
      <div className="loading">
        <Spinner />
      </div>
    )
  }

  renderNoResults() {
    if (this.state.loading || this.state.query === "" || this.state.likes.length > 0) return

    return (
      <div className="loading">
        <p>No Bookmarks Found For "<strong>{this.state.query}</strong>" :(</p>
      </div>
    )
  }
}

function sortLikes(a, b) {
  if (a.liked_at < b.liked_at) return 1
  if (a.liked_at > b.liked_at) return -1
  return 0
}
