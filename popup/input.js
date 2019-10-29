import { h, Component } from "preact"
import Icon from "./icon"
import config from "../config"

export default class Input extends Component {
  constructor(props) {
    super(props)

    this.setState({
      value: props.value,
      placeholder: this.props.placeholder
    })
  }

  componentDidMount() {
    if (this.props.autofocus) this.focus()
  }

  shouldComponentUpdate(nextProps, nextState) {
    const nextSuggestions =
      nextProps.suggestions && nextProps.suggestions.join(",")
    const currentSuggestions =
      this.props.suggestions && this.props.suggestions.join(",")

    return (
      nextState.value !== this.state.value ||
      nextState.placeholder !== this.state.placeholder ||
      nextState.selectedSuggestion !== this.state.selectedSuggestion ||
      nextSuggestions != currentSuggestions
    )
  }

  focus() {
    this.el.focus()
  }

  hasSuggestions() {
    return !!this.props.suggestions && !!this.props.suggestions.length
  }

  selectedIndex(index) {
    return Math.abs(
      (index !== undefined ? index : this.state.selectedSuggestion) %
        this.props.suggestions.length
    )
  }

  selectSuggestion(selectedSuggestion, triggerEnterEvent) {
    const value = this.props.suggestions[this.selectedIndex(selectedSuggestion)]

    this.setState({
      selectedSuggestion,
      value
    })

    if (triggerEnterEvent) {
      this.onKeyUp({ keyCode: 13, target: { value } })
    }
  }

  selectNextSuggestion() {
    if (typeof this.state.selectedSuggestion !== "number") {
      return this.selectSuggestion(0)
    }

    this.selectSuggestion(this.state.selectedSuggestion - 1)
  }

  selectPrevSuggestion() {
    if (typeof this.state.selectedSuggestion !== "number") {
      return this.selectSuggestion(0)
    }

    this.selectSuggestion(this.state.selectedSuggestion + 1)
  }

  reset() {
    this.setState({
      value: "",
      selectedSuggestion: 0
    })
  }

  onFocus(e) {}

  onBlur(e) {}

  onInput(e) {
    this.setState({
      value: e.target.value,
      selectedSuggestion: undefined
    })

    if (this.props.onChange) {
      this.props.onChange(this.state.value)
    }
  }

  onKeyDown(e) {
    if (this.props.onPressEsc && e.keyCode === 27) {
      e.preventDefault()
    }
  }

  onKeyUp(e) {
    const value = e.target.value

    if (e.keyCode === 27) {
      if (this.props.onPressEsc) {
        return this.props.onPressEsc(value)
      } else {
        this.reset()
      }
    }

    if (e.keyCode === 13 && this.props.onPressEnter) {
      return this.props.onPressEnter(value)
    }

    if (e.keyCode === 188 && this.props.onTypeComma) {
      this.reset()
      return this.props.onPressEnter(value)
    }

    if (e.keyCode === 38 && this.hasSuggestions()) {
      this.selectPrevSuggestion()
      return e.preventDefault()
    }

    if (e.keyCode === 40 && this.hasSuggestions()) {
      this.selectNextSuggestion()
      return e.preventDefault()
    }
  }

  render() {
    return (
      <div className="input">
        {this.props.icon ? (
          <Icon name={this.props.icon} stroke={this.props.iconStroke} />
        ) : null}
        <input
          type="text/css"
          placeholder={this.state.placeholder}
          onInput={e => this.onInput(e)}
          onKeyDown={e => this.onKeyDown(e)}
          onKeyUp={e => this.onKeyUp(e)}
          onFocus={e => this.onFocus(e)}
          onBlur={e => this.onBlur(e)}
          onPressEsc={e => this.onPressEsc()}
          value={this.state.value || undefined}
          ref={input => (this.el = input)}
          type={this.props.type || "text"}
          autocomplete={this.props.autocomplete === false ? "off" : "on"}
        />
        {this.renderSuggestions()}
      </div>
    )
  }

  renderSuggestions() {
    if (!this.hasSuggestions()) return

    return (
      <ul className="suggestions">
        {this.props.suggestions.slice(0, 3).map((s, ind) => (
          <li
            onClick={() => this.selectSuggestion(ind, true)}
            className={this.selectedIndex() === ind ? "selected" : ""}
          >
            {s}
            <a href={`${config.host}/tag/${s}`} />
          </li>
        ))}
      </ul>
    )
  }
}
