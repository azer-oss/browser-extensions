import { h, Component } from "preact"

export default class Content extends Component {
  render() {
    return (
      <div className="content-wrapper">
        <div className="center">
          <div className={`content ${this.props.focused ? "focused" : ""}`}>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}
