import { h, Component } from "preact"
import img from "img"
import debounce from "debounce-fn"
import randomColor from "random-color"
import { join } from "path"

export const popularIcons = {
  "facebook.com":
    "https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/N4H_50KFp8i.png",
  "twitter.com":
    "https://ma-0.twimg.com/twitter-assets/responsive-web/web/ltr/icon-ios.a9cd885bccbcaf2f.png",
  "youtube.com": "https://www.youtube.com/yts/img/favicon_96-vflW9Ec0w.png",
  "amazon.com":
    "https://images-na.ssl-images-amazon.com/images/G/01/anywhere/a_smile_120x120._CB368246573_.png",
  "google.com":
    "https://www.google.com/images/branding/product_ios/2x/gsa_ios_60dp.png",
  "yahoo.com": "https://www.yahoo.com/apple-touch-icon-precomposed.png",
  "reddit.com": "https://www.redditstatic.com/mweb2x/favicon/120x120.png",
  "instagram.com":
    "https://www.instagram.com/static/images/ico/apple-touch-icon-120x120-precomposed.png/004705c9353f.png",
  "getkozmos.com":
    "https://getkozmos.com/public/logos/kozmos-heart-logo-100px.png",
  "github.com": "https://github.githubassets.com/pinned-octocat.svg",
  "gist.github.com": "https://github.githubassets.com/pinned-octocat.svg",
  "mail.google.com":
    "https://www.google.com/images/icons/product/googlemail-128.png",
  "gmail.com": "https://www.google.com/images/icons/product/googlemail-128.png",
  "paypal.com": "https://www.paypalobjects.com/webstatic/icon/pp144.png",
  "slack.com":
    "https://assets.brandfolder.com/pl546j-7le8zk-6gwiyo/view@2x.png",
  "imdb.com":
    "http://ia.media-imdb.com/images/G/01/imdb/images/desktop-favicon-2165806970._CB522736561_.ico",
  "en.wikipedia.org": "https://en.wikipedia.org/static/favicon/wikipedia.ico",
  "wikipedia.org": "https://en.wikipedia.org/static/favicon/wikipedia.ico",
  "espn.com": "http://a.espncdn.com/favicon.ico",
  "twitch.tv":
    "https://static.twitchcdn.net/assets/favicon-75270f9df2b07174c23ce844a03d84af.ico",
  "cnn.com":
    "http://cdn.cnn.com/cnn/.e/img/3.0/global/misc/apple-touch-icon.png",
  "office.com":
    "https://seaofficehome.msocdn.com/s/7047452e/Images/favicon_metro.ico",
  "bankofamerica.com":
    "https://www1.bac-assets.com/homepage/spa-assets/images/assets-images-global-favicon-favicon-CSX386b332d.ico",
  "chase.com": "https://www.chase.com/etc/designs/chase-ux/favicon-152.png",
  "nytimes.com": "https://static01.nyt.com/images/icons/ios-ipad-144x144.png",
  "apple.com": "https://www.apple.com/favicon.ico",
  "wellsfargo.com":
    "https://www.wellsfargo.com/assets/images/icons/apple-touch-icon-120x120.png",
  "yelp.com":
    "https://s3-media2.fl.yelpcdn.com/assets/srv0/yelp_styleguide/118ff475a341/assets/img/logos/favicon.ico",
  "wordpress.com": "http://s0.wp.com/i/webclip.png",
  "dropbox.com":
    "https://cfl.dropboxstatic.com/static/images/favicon-vflUeLeeY.ico",
  "mail.superhuman.com":
    "https://superhuman.com/build/71222bdc169e5906c28247ed5b7cf0ed.share-icon.png",
  "aws.amazon.com":
    "https://a0.awsstatic.com/libra-css/images/site/touch-icon-iphone-114-smile.png",
  "console.aws.amazon.com":
    "https://a0.awsstatic.com/libra-css/images/site/touch-icon-iphone-114-smile.png",
  "us-west-2.console.aws.amazon.com":
    "https://a0.awsstatic.com/libra-css/images/site/touch-icon-iphone-114-smile.png",
  "stackoverflow.com":
    "https://cdn.sstatic.net/Sites/stackoverflow/img/apple-touch-icon.png"
}

export default class URLImage extends Component {
  constructor(props) {
    super(props)
    this._refreshSource = debounce(this.refreshSource.bind(this))
  }

  componentWillReceiveProps(props) {
    if (this.props.content.url !== props.content.url) {
      this._refreshSource(props.content)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.content.url !== this.props.content.url) {
      return true
    }

    if (nextState.src !== this.state.src) {
      return true
    }

    if (
      nextState.loading !== this.state.loading ||
      nextState.error !== this.state.error
    ) {
      return true
    }

    if (
      !nextProps.content.images ||
      this.props.content.images ||
      (nextProps.content.images || !this.props.content.images) ||
      nextProps.content.images[0] !== this.props.content.images[0]
    ) {
      return true
    }

    return false
  }

  componentWillMount() {
    this.refreshSource()
  }

  refreshSource(content) {
    this.setState({
      color: randomColor(100, 50)
    })

    this.findSource(content)
    this.preload(this.state.src)
  }

  findSource(content) {
    content || (content = this.props.content)

    if (!content.url) {
      return
    }

    if (
      !this.props["icon-only"] &&
      content.images &&
      content.images.length > 0 &&
      content.images[0]
    ) {
      return this.setState({
        type: "image",
        src: content.images[0]
      })
    }

    if (content.icon) {
      return this.setState({
        type: "icon",
        src: absoluteIconURL(content)
      })
    }

    const hostname = findHostname(content.url)
    if (popularIcons[hostname]) {
      return this.setState({
        type: "popular-icon",
        src: popularIcons[hostname]
      })
    }

    if (/\.slack\.com$/.test(hostname)) {
      return this.setState({
        type: "popular-icon",
        src: popularIcons["slack.com"]
      })
    }

    this.setState({
      type: "favicon",
      src: "http://" + hostname + "/favicon.ico"
    })
  }

  preload(src) {
    if (
      this.state.loading &&
      this.state.loadingFor === this.props.content.url
    ) {
      return
    }

    this.setState({
      error: null,
      loading: true,
      loadingFor: this.props.content.url,
      loadingSrc: src,
      src: this.cachedIconURL()
    })

    img(src, err => {
      if (this.state.loadingSrc !== src) {
        return
      }

      if (err) {
        return this.setState({
          loading: false,
          error: err,
          src: this.cachedIconURL()
        })
      }

      this.setState({
        src: src,
        loading: false,
        error: null
      })
    })
  }

  render() {
    if (this.state.loading || this.state.error) {
      return this.renderLoading()
    }

    const style = {
      backgroundImage: `url(${this.state.src})`
    }

    return (
      <div
        tabindex="-1"
        className={`url-image ${this.state.type}`}
        style={style}
      />
    )
  }

  renderLoading() {
    const style = {
      backgroundColor: this.state.color
    }

    return (
      <div
        data-error={this.state.error}
        data-type={this.state.type}
        data-src={this.state.src}
        className="url-image generated-image center"
        style={style}
      >
        <span>{this.props.content.renderFirstLetter()}</span>
      </div>
    )
  }

  cachedIconURL() {
    if (!this.props.content.url) return

    return (
      "chrome://favicon/size/72/" +
      findProtocol(this.props.content.url) +
      "://" +
      findHostname(this.props.content.url)
    )
  }
}

function absoluteIconURL(like) {
  if (/^https?:\/\//.test(like.icon)) return like.icon
  return "http://" + join(findHostname(like.url), like.icon)
}

export function findHostname(url) {
  return url
    .replace(/^\w+:\/\//, "")
    .split("/")[0]
    .replace(/^www\./, "")
}

export function findProtocol(url) {
  if (!/^https?:\/\//.test(url)) return "http"
  return url.split("://")[0]
}
