import { h, Component } from "preact"

export default class Content extends Component {
  render() {
    const bg = this.props.wallpaper ? {
      backgroundImage: `url(${this.props.wallpaper.urls.thumb})`
    } : null

    return (
      <div className="content-wrapper">
        <div className="bg" style={bg}></div>
        <div className="center">
          <div className="content">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}
