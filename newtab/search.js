import { h, Component } from "preact"
import debounce from "debounce-fn"
import Content from "./content"
import SearchInput from "./search-input"
import Results from "./results"
import Messaging from "./messaging"
import Greeting from "./greeting"

export default class Search extends Component {
  constructor(props) {
    super(props)
    this.messages = new Messaging()

    this.setState({
      id: 0,
      rows: {},
      rowsAvailable: 5,
      query: '',
      focused: false
    })

    this._onQueryChange = debounce(this.onQueryChange.bind(this), 250)
  }

  id() {
    return ++this.state.id
  }

  onFocus() {
    this.setState({
      focused: true
    })
  }

  onBlur() {
    this.setState({
      focused: false
    })
  }

  onPressEnter() {
    if (this.state.selected) {
      this.navigateTo(this.state.selected.url)
    }
  }

  onSelect(row) {
    if (this.state.selected && this.state.selected.id === row.id) return

    this.setState({
      selected: row
    })
  }

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
      <Content wallpaper={this.props.wallpaper} focused={this.state.focused}>
        <div className="content-inner">
          {this.props.enableGreeting ? <Greeting name={this.state.username} messages={this.messages} /> : null}
          <SearchInput onPressEnter={() => this.onPressEnter()}
            onQueryChange={this._onQueryChange}
            onFocus={() => this.onFocus()}
            onBlur={() => this.onBlur()}
            value={this.state.query}
            />
            <Results nextWallpaper={this.props.nextWallpaper} prevWallpaper={this.props.prevWallpaper} openTag={tag => this._onQueryChange('tag:' + tag)} focused={this.state.focused} query={this.state.query} />
            <div className="clear"></div>
        </div>
      </Content>
    )
  }

  renderResults() {
    return (
      <div className="results">
        <div className="results-rows">
        </div>
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
