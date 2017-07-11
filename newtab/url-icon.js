import { h, Component } from "preact"
import icons from './icons'
import img from 'img'
import titleFromURL from "title-from-url"
import { join } from "path"

const popularIcons = {
  'facebook.com': 'https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/N4H_50KFp8i.png',
  'twitter.com': 'https://ma-0.twimg.com/twitter-assets/responsive-web/web/ltr/icon-ios.a9cd885bccbcaf2f.png',
  'youtube.com': 'https://m.youtube.com/yts/mobile/img/apple-touch-icon-144x144-precomposed-vflwq-hLZ.png',
  'amazon.com': 'https://images-na.ssl-images-amazon.com/images/G/01/anywhere/a_smile_120x120._CB368246573_.png',
  'google.com': 'https://www.google.com/images/branding/product_ios/2x/gsa_ios_60dp.png',
  'yahoo.com': 'https://www.yahoo.com/apple-touch-icon-precomposed.png',
  'reddit.com': 'https://www.redditstatic.com/mweb2x/favicon/120x120.png',
  'instagram.com': 'https://www.instagram.com/static/images/ico/apple-touch-icon-120x120-precomposed.png/004705c9353f.png'
}

export default class URLIcon extends Component {
  componentWillReceiveProps(props) {
    this.preload(this.imageURL(props))
  }

  componentWillMount() {
    this.preload(this.imageURL())
  }

  render() {
    return (
      <a className="urlicon" href={this.url()} title={`${this.title()} - ${this.props.url}`}>
        {this.renderImage()}
        <div className="title">
        {this.title()}
        </div>
      </a>
    )
  }

  renderImage() {
    if (this.state.loading || !this.state.image) return this.renderDefaultImage()

    const style = {
      backgroundImage: `url(${this.state.image})`
    }

    return (
      <div className="image" style={style}></div>
    )
  }

  renderDefaultImage() {
    return (
      <img className="default-image" src={icons.black.page} />
    )
  }

  title() {
    const original = this.props.title || ""
    if (original.length > 0 && !/^https?:\/\//.test(original)) return original.replace(/^\(\d+\) /, '')
    return titleFromURL(original)
  }

  url(props) {
    if (/^https?:\/\//.test((props || this.props).url)) return (props || this.props).url
    return 'http://' + (props || this.props).url
  }

  protocol(props) {
    if (!/^https?:\/\//.test((props || this.props).url)) {
      return 'http'
    }

    return (props || this.props).url.split('://')[0]
  }

  hostname(props) {
    return (props || this.props).url.replace(/^\w+:\/\//, '').split('/')[0].replace(/^www\./, '')
  }

  imageURL(props) {
    const hostname = this.hostname(props)

    if (popularIcons[hostname]) {
      return popularIcons[hostname]
    }

    if ((props || this.props).icon) {
      return absoluteIconURL(props || this.props)
    }

    return this.protocol(props) + '://' + hostname + '/favicon.ico'
  }

  preload(url) {
    this.setState({
      loading: true,
      image: null
    })

    img(url, err => {
      if (err) return this.setState({ loading: false, image: null })

      this.setState({
        image: url,
        loading: false
      })
    })
  }
}

function absoluteIconURL (like) {
  if (/^https?:\/\//.test(like.icon)) return like.icon
  return 'http://' + join(like.url.split('/')[0], like.icon)
}
