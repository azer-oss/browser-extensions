import { h, Component } from "preact"
import icons from './icons'

export default class SearchInput extends Component {
  componentDidMount() {
    if (this.input) this.input.focus()
  }

  render() {
    return (
      <div className="search-input">
        {this.renderIcon()}
        {this.renderInput()}
      </div>
    )
  }

  renderIcon() {
    return (
      <img className="icon" src={icons.black.search} />
    )
  }

  renderInput() {
    return (
      <input ref={el => this.input = el}
        type="text"
        className="input"
        placeholder="Search your history and bookmarks"
        onChange={e => this.props.onQueryChange(e.target.value)}
        onKeyUp={e => this.props.onQueryChange(e.target.value)}
        value={this.props.query} />
    )
  }
}
