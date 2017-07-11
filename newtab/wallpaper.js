import { h, Component } from "preact"

export default class Wallpaper extends Component {
  render() {
    const style = {
      backgroundImage: `url(${this.props.urls.full})`
    }

    return (
      <div className="wallpaper" style={style}>
        {this.renderAuthor()}
      </div>
    )
  }

  renderAuthor() {
    let name = this.state.user.name || this.state.user.username
    let link = this.state.user.portfolio_url || ('https://unsplash.com/@' + this.state.user.username)
    const profilePhotoStyle = {
      backgroundImage: `url(${this.state.user.profile_image.small})`
    }

    return (
      <a href={link} className="author">
        <span className="profile-image" style={profilePhotoStyle}></span>
        <label>Photographer: </label>{name}
      </a>
    )
  }
}
