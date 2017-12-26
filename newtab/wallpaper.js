import { h, Component } from "preact"
import img from "img"
import wallpapers from './wallpapers'
const ONE_DAY = 1000 * 60 * 60 * 24

export default class Wallpaper extends Component {
  selected() {
    return this.src(this.today()  + (this.props.index || 0))
  }

  today() {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000)
    return Math.floor(diff / ONE_DAY)
  }

  src(index) {
    return wallpapers[index % wallpapers.length]
  }

  width() {
    return window.innerWidth
  }

  url(src) {
    return src.url + '?auto=format&fit=crop&w=' + this.width()
  }

  render() {
    const src = this.selected()

    const style = {
      backgroundImage: `url(${this.url(src)})`
    }

    if (src.position) {
      style.backgroundPosition = src.position
    }

    return (
      <div className="wallpaper" style={style}></div>
    )
  }
}
