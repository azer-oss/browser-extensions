import { h, Component } from "preact"
import debounce from "debounce-fn"
import titleFromURL from "title-from-url"
import Content from "./content"
import Messaging from "./messaging"
import SearchInput from "./search-input"
import URLIcon from "./url-icon"
import { findHostname } from './url-image'
import URLs from "./urls"
import Spinner from "./spinner"
import Sidebar from "./sidebar"
import * as topSites from './top-sites'

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

    topSites.get((topSites) => {
      this.setState({
        topSites: topSites,
        selected: {
          url: topSites[0].url,
          title: topSites[1].title
        }
      })
    })

    //this.getRecentBookmarks((err, likes) => this.setState({ likes }))

    this._onKeyPress = debounce(this.onKeyPress.bind(this))
    this._onQueryChange = debounce(this.onQueryChange.bind(this))
  }

  componentWillMount() {
    window.addEventListener('keyup', this._onKeyPress, false)
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this._onKeyPress, false)
  }

  navigateTo(url) {
    if (!/^\w+:\/\//.test(url)) {
      url = 'http://' + url
    }

    document.location.href = url
  }

  onPressEnter() {
    if (this.state.selected) {
      this.navigateTo(this.state.selected.url)
    }
  }

  onUpdateTopSites() {
    topSites.get((topSites) => {
      this.setState({
        topSites: topSites,
        selected: topSites[0],
        image: 'chrome://favicon/size/72/' + topSites[0].url
      })
    })
  }

  onKeyPress(e) {
    if (e.keyCode == 40) {
      this.selectNext()
    } else if (e.keyCode == 38) {
      this.selectPrevious()
    }
  }

  onSelect(row) {
    if (this.state.selected && this.state.selected.url === row.url) return

    this.setState({
      selected: row
    })
  }

  getRecentBookmarks(callback) {
    this.messages.send({ task: 'get-recent-bookmarks' }, resp => {
      if (resp.error) return callback(new Error(resp.error))
      callback(undefined, resp.content.results.likes)
    })
  }

  _searchBookmarks(query, callback) {
    this.messages.send({ task: 'search-bookmarks', query }, resp => {
      if (resp.error) return callback(new Error(resp.error))
      if (resp.content.query !== this.state.query) return
      callback(undefined, resp.content.results.likes)
    })
  }

  generateQueryRow(query) {
    if (query.length === 0) return null

    if (query.trim().indexOf('.') > 0 && query.indexOf(' ') === -1) {
      let url = /\w+:\/\//.test(query) ? query : 'http://' + query

      return {
        url: url,
        title: titleFromURL(query),
        image: 'chrome://favicon/size/72/' + url,
        type: 'url-query'
      }
    }

    let url = 'https://google.com/search?q=' + encodeURI(query)
    return {
      url: url,
      query: query,
      title: `Search "${query}" on Google`,
      type: 'search-query'
    }
  }

  onQueryChange(query) {
    query = query.trim()

    const queryRow = this.generateQueryRow(query)
    this.setState({
      selected: queryRow,
      queryRow
    })

    if (query.length == 0) {
      return this.setState({
        loading: false,
        likes: [],
        query: "",
        selected: this.state.topSites ? this.state.topSites[0] : null
      })
    }

    if (query === this.state.query) return

    this.setState({
      loading: true,
      likes: [],
      history: [],
      query
    })

    this.searchBookmarks(query, (error, likes) => {
      if (error) return this.setState({ error, loading: false })

      this.setState({
        likes: likes.sort(sortLikes),
        loading: false
      })
    })

    chrome.history.search({ text: query }, history => {
      this.setState({
        history: history.filter(filterOutGoogle)
      })
    })
  }

  render() {
    return (
      <Content wallpaper={this.props.wallpaper}>
        <div className="content-inner">
          <SearchInput onPressEnter={() => this.onPressEnter()} onQueryChange={this._onQueryChange} />
          {this.renderResults()}
          <div className="clear"></div>
        </div>
      </Content>
    )
  }

  renderLoading() {
    return (
      <div className="loading results">
        <Spinner />
      </div>
    )
  }

  renderResults() {
    return (
      <div className="results">
        <div className="results-rows">
          {this.renderQuerySelection()}
          {this.renderTopSites()}
          {this.renderHistory()}
          {this.renderLikes()}
        </div>
        <Sidebar selected={this.state.selected} messages={this.messages} onUpdateTopSites={() => this.onUpdateTopSites()} />
        <div className="clear"></div>
      </div>
    )
  }

  renderQuerySelection() {
    if (!this.state.queryRow) return

    return (
      <div className="urls">
        <URLIcon content={this.state.queryRow} selected={this.state.selected && this.state.selected.url === this.state.queryRow.url} onSelect={(row) => this.onSelect(row)} />
      </div>
    )
  }

  renderTopSites() {
    if (this.state.query) return

    return (
      <URLs title="Frequently Visited" selected={this.state.selected} content={this.state.topSites} onSelect={(row) => this.onSelect(row)} type="top" />
    )
  }

  renderHistory() {
    if (!this.state.query || !this.state.history || this.state.history.length === 0) return

    let len = Math.max(0, 4 - this.state.likes.length)
    if (len === 0) return

    return (
      <URLs title="Previously Visited" content={this.state.history.slice(0, len)} selected={this.state.selected} onSelect={(row) => this.onSelect(row)} />
    )
  }

  renderLikes() {
    if (!this.state.likes) return

    return (
      <URLs title="Liked in Kozmos" content={this.state.likes.slice(0, 4)} selected={this.state.selected} onSelect={(row) => this.onSelect(row)} type="top" />
    )
  }

  renderMoreResultsLink() {
    return (
      <a className="more-results-button" href={`https://getkozmos.com/search?query=${this.state.query}`}>
        See More Results
      </a>
    )
  }

  renderNoResults() {
    if (this.state.loading || this.state.query === "" || this.state.likes.length > 0) return

    return (
      <div className="noresults">
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

function filterOutGoogle (row) {
  return findHostname(row.url).split('.')[0] !== 'google'
}
