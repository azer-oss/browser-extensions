import { h, Component } from 'preact'
import Icon from "./icon"

export default class Input extends Component {
  constructor(props) {
    super(props)
    this.setState({
      value: "",
      placeholder: this.props.placeholder
    })
  }

  componentDidMount() {
    if (this.props.autofocus) this.focus()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.value !== this.state.value
  }

  focus () {
    this.el.focus()
  }

  onFocus(e) {
    this.setState({
      placeholder: ""
    })
  }

  onBlur(e) {
    this.setState({
      placeholder: this.props.placeholder
    })
  }

  onChange(e) {
    this.setState({
      value: e.target.value
    })

    if (this.props.onChange) {
      this.props.onChange(this.state.value)
    }
  }

  onKeyUp(e) {
    const value = e.target.value;
    this.onChange(e)

    if (e.keyCode === 27) {
      this.setState({ value: "" })

      if (this.props.onPressEsc) {
        return this.props.onPressEsc(value)
      }
    }

    if (e.keyCode === 13 && this.props.onPressEnter) {
      this.setState({ value: "" })
      return this.props.onPressEnter(value)
    }

    if (e.keyCode === 188 && this.props.onTypeComma) {
      this.setState({ value: "" })
      return this.props.onPressEnter(value)
    }
  }

  render() {
    return (
      <div className="input">
        {this.props.icon ? <Icon name={this.props.icon} stroke={this.props.iconStroke} /> : null}
        <input type="text/css"
               placeholder={this.state.placeholder}
               onChange={(e) => this.onChange(e)}
               onKeyUp={(e) => this.onKeyUp(e)}
               onFocus={(e) => this.onFocus(e)}
               onBlur={(e) => this.onBlur(e)}
               value={this.state.value}
               ref={input => this.el = input}
               type={this.props.type || "text"}
               autocomplete={this.props.autocomplete === false ? "off" : "on"}
        />
      </div>
    )
  }
}
