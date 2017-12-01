import { h, Component } from "preact"
import debounce from "debounce-fn"

import Content from "./content"
import Messaging from "./messaging"
import SearchInput from "./search-input"
import URLIcon from "./url-icon"

import TopSites from "./top-sites"
import QuerySuggestions from "./query-suggestions"
import BookmarkSearch from "./bookmark-search"
import Sidebar from "./sidebar"
import History from "./history"

export default class Search extends Component {
  constructor(props) {
    super(props)
    this.messages = new Messaging()

    this.setState({
      id: 0,
      rows: {},
      rowsAvailable: 5,
      query: ''
    })

    this._onKeyPress = debounce(this.onKeyPress.bind(this), 50)
    this._onQueryChange = debounce(this.onQueryChange.bind(this))
  }


  id() {
    return ++this.state.id
  }

  navigateTo(url) {
    if (!/^\w+:\/\//.test(url)) {
      url = 'http://' + url
    }

    document.location.href = url
  }

  mapRow(row) {
    this.state.rows[row.id] = row
  }

  selectNext() {
    let id = this.state.selected ? this.state.selected.id : 0
    if (id == 5) id = 0

    this.setState({
      selected: this.state.rows[id + 1]
    })
  }

  selectPrevious() {
    let id = this.state.selected ? this.state.selected.id : 6
    if (id == 1) id = 6

    this.setState({
      selected: this.state.rows[id - 1]
    })
  }

  reserveRows(count) {
    let left = this.state.rowsAvailable - count

    this.setState({
      rowsAvailable: Math.max(left, 0)
    })

    return left < 0 ? count + left : count
  }

  componentWillMount() {
    window.addEventListener('keyup', this._onKeyPress, false)
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this._onKeyPress, false)
  }

  onPressEnter() {
    if (this.state.selected) {
      this.navigateTo(this.state.selected.url)
    }
  }

  onKeyPress(e) {
    if (e.keyCode == 40) {
      this.selectNext()
    } else if (e.keyCode == 38) {
      this.selectPrevious()
    }
  }

  onSelect(row) {
    if (this.state.selected && this.state.selected.id === row.id) return

    this.setState({
      selected: row
    })
  }

  /*getRecentBookmarks(callback) {
    this.messages.send({ task: 'get-recent-bookmarks' }, resp => {
      if (resp.error) return callback(new Error(resp.error))
      callback(undefined, resp.content.results.likes)
    })
  }

  searchBookmarks(query, callback) {
    this.messages.send({ task: 'search-bookmarks', query }, resp => {
      if (resp.error) return callback(new Error(resp.error))
      if (resp.content.query !== this.state.query) return
      callback(undefined, resp.content.results.likes)
    })
  }*/

  onQueryChange(query) {
    query = query.trim()

    if (query === this.state.query) return

    this.setState({
      rows: {},
      rowsAvailable: 5,
      selected: null,
      id: 0,
      query
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

  renderResults() {
    return (
      <div className="results">
        <div className="results-rows">
          <QuerySuggestions query={this.state.query} id={() => this.id()} onSelect={id => this.onSelect(id)} selected={this.state.selected} reserveRows={c => this.reserveRows(c)} mapRow={r => this.mapRow(r)} />
          <TopSites query={this.state.query} id={() => this.id()} onSelect={id => this.onSelect(id)} selected={this.state.selected} reserveRows={c => this.reserveRows(c)} mapRow={r => this.mapRow(r)} />
          <BookmarkSearch messages={this.messages} query={this.state.query} id={() => this.id()} onSelect={id => this.onSelect(id)} selected={this.state.selected} reserveRows={c => this.reserveRows(c)} mapRow={r => this.mapRow(r)} />
          <History query={this.state.query} id={() => this.id()} onSelect={id => this.onSelect(id)} selected={this.state.selected} reserveRows={c => this.reserveRows(c)}  mapRow={r => this.mapRow(r)} />
        </div>
        <Sidebar selected={this.state.selected} messages={this.messages} onUpdateTopSites={() => this.onUpdateTopSites()} />
        <div className="clear"></div>
      </div>
    )
  }

}

function sortLikes(a, b) {
  if (a.liked_at < b.liked_at) return 1
  if (a.liked_at > b.liked_at) return -1
  return 0
}
