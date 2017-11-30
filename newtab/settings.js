import { h, Component } from "preact"
import Icon from "../popup/icon"

export default class Settings extends Component {
  render() {
    return (
      <div className={`settings ${this.props.open ? "open" : ""}`}>
        <Icon name="options" />
      </div>
    )
  }
}
