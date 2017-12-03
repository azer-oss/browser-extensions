import { h, Component } from "preact"
import img from "img"
import wallpapers from './wallpapers'
const ONE_DAY = 1000 * 60 * 60 * 24

export default class Wallpaper extends Component {
  constructor(props) {
    super(props)
    setTimeout(this.cacheTomorrow(), 1000)
  }

  today() {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000)
    return Math.floor(diff / ONE_DAY)
  }

  selected() {
    return wallpapers[this.today() % wallpapers.length]
  }

  cacheTomorrow() {
    const url = wallpapers[(this.today() + 1) % wallpapers.length].url
    if (localStorage['last-wallpaper-cache'] === url) return

    img(url, err => {
      localStorage['last-wallpaper-cache'] = url
    })
  }

  render() {
    const selected = this.selected()
    const style = {
      backgroundImage: `url(${selected.url})`
    }

    if (selected.position) {
      style.backgroundPosition = selected.position
    }

    return (
      <div className="wallpaper" style={style}></div>
    )
  }

  renderAuthor() {
    let name = this.props.content.user.name || this.props.content.user.username
    let link = this.props.content.user.portfolio_url || ('https://unsplash.com/@' + this.props.content.user.username)
    const profilePhotoStyle = {
      backgroundImage: `url(${this.props.content.user.profile_image.small})`
    }

    return (
      <a href={link} className="author" title={`Photo was shot by ${this.props.content.user.name}`}>
        <span className="profile-image" style={profilePhotoStyle}></span>
        <label>Photographer: </label>{name}
      </a>
    )
  }
}
