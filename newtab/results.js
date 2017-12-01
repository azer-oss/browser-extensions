import { h, Component } from "preact"

import TopSites from "./top-sites"
import QuerySuggestions from "./query-suggestions"
import BookmarkSearch from "./bookmark-search"
import Sidebar from "./sidebar"
import History from "./history"

const categories = {
  'query-suggestions': 1,
  'top': 2,
  'bookmark-search': 3,
  'history': 4
}

export default class Results extends Component {
  constructor(props) {
    super(props)

    this.setState({
      selected: 0,
      rows: []
    })
  }

  categories() {

  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.query !== nextProps.query || !this.state.rows || this.state.rows.length !== nextState.rows.length) {
      return true
    }

    if ((!this.props.selected && nextProps.selected) || (this.props.selected && !nextProps.selected) || (this.props.selected && nextProps.selected && this.props.selected.id !== nextProps.selected.id)) {
      return true
    }

    let i = Math.min(5, this.state.rows.length);
    while (i--) {
      if (this.state.rows[i].url !== nextState.rows[i].url) {
        return true
      }
    }

    return false
  }

  render() {
    const categories = this.categories()

    return (
      <div className="results">
        <div className="results-rows">
          <QuerySuggestions query={this.props.query} id={() => this.id()} onSelect={id => this.onSelect(id)} selected={this.state.selected} reserveRows={c => this.reserveRows(c)} mapRow={r => this.mapRow(r)} />
          <TopSites query={this.props.query} id={() => this.id()} onSelect={id => this.onSelect(id)} selected={this.state.selected} reserveRows={c => this.reserveRows(c)} mapRow={r => this.mapRow(r)} />
          <BookmarkSearch messages={this.props.messages} query={this.props.query} id={() => this.id()} onSelect={id => this.onSelect(id)} selected={this.state.selected} reserveRows={c => this.reserveRows(c)} mapRow={r => this.mapRow(r)} />
          <History query={this.state.query} id={() => this.id()} onSelect={id => this.onSelect(id)} selected={this.state.selected} reserveRows={c => this.reserveRows(c)}  mapRow={r => this.mapRow(r)} />
        </div>
        <Sidebar selected={this.state.selected} messages={this.messages} onUpdateTopSites={() => this.onUpdateTopSites()} />
        <div className="clear"></div>
      </div>
    )
  }
}
