import { h, Component } from "preact"
import Icon from "./icon"

export default class Button extends Component {
  render() {
    return (
      <div className="buttons">
        <div className="button" title={this.props.title} onClick={this.props.onClick}>
          { this.props.icon ? <Icon name={this.props.icon} /> : null}
          {this.props.children}
        </div>
      </div>
    )
  }
}
