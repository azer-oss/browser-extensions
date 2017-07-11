import { h, Component } from "preact"
import { join } from "path"

export default class Likes extends Component {
  render() {
    return (
      <div className="likes">
        {this.renderTitle()}
        <ul>
          {this.props.likes.filter(hasIcon).slice(0, 5).map(l => this.renderLike(l))}
        </ul>
        <div className="clear"></div>
      </div>
    )
  }

  renderLike(like) {
    const style = {
      backgroundImage: `url(${iconURL(like)})`
    }

    return (
      <li className="like">
        <div className="icon" style={style}></div>
        <a  title={like.title} href={`http://${like.url}`}>{like.title}</a>
      </li>
    )
  }

  renderTitle() {
    return (
      <h1><span>Searching <strong>"{this.props.query}"</strong></span></h1>
    )
  }
}

function hasIcon (like) {
  return !!like.icon
}

function iconURL (like) {
  if (/^https?:\/\//.test(like.icon)) return like.icon
  return 'http://' + join(like.url.split('/')[0], like.icon)
}
