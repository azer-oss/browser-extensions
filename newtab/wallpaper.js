import { h, Component } from "preact"
import img from "img"
import wallpapers from './wallpapers'
const ONE_DAY = 1000 * 60 * 60 * 24

export default class Wallpaper extends Component {
  componentWillMount() {
    this.load()
  }

  componentWillReceiveProps(props) {
    if (props.index !== this.props.index) {
      this.load()
    }
  }

  load() {
    this.setState({
      loading: true,
      src: null
    })

    img(this.selected().url, err => {
      if (err) return this.onError(err)

      this.setState({
        loading: false,
        src: this.selected()
      })
    })

    setTimeout(() => {
      if (!this.state.loading || this.props.index) return

      let start = Date.now()
      let cached = img(this.url(this.src(this.yesterday())), err => {
        if (err || !this.state.loading) return

        this.setState({
          src: this.src(this.yesterday())
        })
      })

      setTimeout(() => {
        cached.src = '';
      }, 1000)
    }, 500)
  }

  onError(error) {
    console.error(error)

    this.setState({
      loading: false,
      error
    })
  }

  today() {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000)
    return Math.floor(diff / ONE_DAY)
  }

  yesterday() {
    return this.today() - 1
  }

  src(index) {
    return wallpapers[index % wallpapers.length]
  }

  selected() {
    return this.src(this.today()  + (this.props.index || 0))
  }

  width() {
    return window.innerWidth
  }

  url(src) {
    return src.url + '?auto=format&fit=crop&w=' + this.width()
  }

  render() {
    if (!this.state.src) return

    const src = this.state.src
    const style = {
      backgroundImage: `url(${this.url(this.state.src)})`
    }

    if (src.position) {
      style.backgroundPosition = src.position
    }

    return (
      <div className="wallpaper" style={style}></div>
    )
  }
}
