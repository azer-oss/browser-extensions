import { h, Component } from "preact"
import Icon from "./icon"

export default class SearchInput extends Component {
  componentDidMount() {
    if (this.input) this.input.focus()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.value !== this.state.value
  }

  onQueryChange(value, keyCode) {
    if (keyCode === 13) {
      return this.props.onPressEnter(value)
    }

    this.setState({ value })

    if (this.queryChangeTimer !== undefined) {
      clearTimeout(this.queryChangeTimer)
      this.queryChangeTimer = 0;
    }

    if (this.props.onQueryChange) {
      this.props.onQueryChange(value)
    }
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
        <Icon name="search" onclick={() => this.input.focus()} />
    )
  }

  renderInput() {
    return (
      <input ref={el => this.input = el}
        type="text"
        className="input"
        placeholder="What are you looking for?"
        onChange={e => this.onQueryChange(e.target.value)}
        onKeyUp={e => this.onQueryChange(e.target.value, e.keyCode)}
        value={this.state.value} />
    )
  }
}
