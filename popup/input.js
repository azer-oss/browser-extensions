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
    this.onChange(e)

    if (e.keyCode === 27 && this.props.onPressEsc) {
      return this.props.onPressEsc(e)
    }

    if (e.keyCode === 13 && this.props.onPressEnter) {
      return this.props.onPressEnter(e)
    }
  }

  render() {
    return (
      <div className="input">
        {this.props.icon ? <Icon name={this.props.icon} /> : null}
        <input type="text/css"
               placeholder={this.state.placeholder}
               onChange={(e) => this.onChange(e)}
               onKeyUp={(e) => this.props.onKeyUp(e)}
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
