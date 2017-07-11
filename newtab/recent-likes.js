import { h, Component } from "preact"
import { join } from "path"

export default class RecentLikes extends Component {
  render() {
    return (
      <div className="recent-likes">
        <h1><span>Recently Liked</span></h1>
        {this.renderNonMedia()}
        {this.renderMedia()}
        <div className="clear"></div>
      </div>
    )
  }

  renderNonMedia() {
    return (
      <ul className="non-media">
        {this.props.likes.nonmedia.filter(hasIcon).slice(0, 6).map(l => this.renderLike(l))}
      </ul>
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

  renderMedia() {
    return (
      <ul className="media">
        {this.props.likes.media.slice(0, 4).map(l => this.renderMediaLike(l))}
      </ul>
    )
  }

  renderMediaLike(like) {
    const style = {
      backgroundImage: `url(${like.image_url})`
    }

    return (
      <li className="like">
        <a title={like.title} href={`http://${like.url}`} style={style}></a>
      </li>
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
