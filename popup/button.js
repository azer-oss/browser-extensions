import { h, Component } from "preact"
import Icon from "./icon"

export default class Button extends Component {
  render() {
    return (
      <div className="button" title={this.props.title} onClick={this.props.onClick}>
        <Icon name={this.props.icon} />
        {this.props.children}
      </div>
    )
  }
}
