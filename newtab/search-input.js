import { h, Component } from "preact"
import Icon from "./icon"

export default class SearchInput extends Component {
  constructor(props) {
    super(props)

    this.setState({
      value: ''
    })

    this._onClick = this.onClick.bind(this)
  }

  componentWillReceiveProps(props) {
    if (props.value && props.value.trim() !== this.state.value.trim()) {
      this.setState({
        value: props.value
      })
    }
  }

  onBlur() {
    if (!this.state.focused) return

    this.setState({
      focused: false
    })

    this.props.onBlur()
  }

  onFocus() {
    if (this.state.focused) return

    this.setState({
      focused: true
    })

    this.props.onFocus()
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
    if (this.state.value === '' && !document.querySelector('.content-wrapper .content').contains(e.target) && !e.target.classList.contains('button')) {
      this.onBlur()
    }
  }

  onQueryChange(value, keyCode, event) {
    if (value.trim() !== "") {
      this.onFocus()
    }

    if (keyCode === 13) {
      return this.props.onPressEnter(value)
    }

    if (keyCode === 27) {
      return this.onBlur()
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
        placeholder="Search or enter website name."
        onFocus={e => this.onFocus()}
        onChange={e => this.onQueryChange(e.target.value, undefined, 'change')}
        onKeyUp={e => this.onQueryChange(e.target.value, e.keyCode, 'key up')}
        onClick={() => this.onFocus()}
        value={this.state.value} />
    )
  }
}
