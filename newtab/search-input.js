import { h, Component } from "preact"
import Icon from "./icon"

export default class SearchInput extends Component {
  constructor(props) {
    super(props)

    this._onClick = this.onClick.bind(this)
  }

  componentDidMount() {
    if (this.input) {
      this.input.focus()
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.value !== this.state.value
  }

  componentWillMount() {
    window.addEventListener('click', this._onClick)
  }

  componentWillUnmount() {
    window.removeEventListener('click', this._onClick)
  }

  onClick(e) {
    if (!document.querySelector('.content-wrapper .content').contains(e.target)) {
      this.props.onBlur()
    }
  }

  onQueryChange(value, keyCode) {
    if (keyCode === 13) {
      return this.props.onPressEnter(value)
    }

    if (keyCode === 27) {
      return this.props.onBlur()
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
      <input tabindex="1"
        ref={el => this.input = el}
        type="text"
        className="input"
        placeholder="Search or enter website name"
        onFocus={e => this.props.onFocus()}
        onChange={e => this.onQueryChange(e.target.value)}
        onKeyUp={e => this.onQueryChange(e.target.value, e.keyCode)}
        value={this.state.value} />
    )
  }
}
