import { h, Component } from "preact"

export default class Settings extends Component {
  render() {
    return (
      <div className={`settings ${this.props.open ? "open" : ""}`}>
        <div className="triangle"></div>
        <h1><span>Settings</span></h1>
      </div>
    )
  }
}
