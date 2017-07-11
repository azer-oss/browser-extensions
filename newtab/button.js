import { h, Component } from "preact"
import icons from './icons'

export default class Button extends Component {
  render() {
    return (
      <div className={`button ${this.props.className || this.props.icon}-button with-${this.props.icon}-icon`} onclick={() => this.onClick()} onMouseOver={this.props.onMouseOver} onMouseOut={this.props.onMouseOut}>
        <img className="icon" src={this.src()} />
      </div>
    )
  }

  onClick() {
    if (this.props.onClick) this.props.onClick()
  }

  src() {
    return icons[this.props.icon]
  }
}
