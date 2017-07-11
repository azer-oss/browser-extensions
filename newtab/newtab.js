import { h, Component, render } from "preact"
import Wallpaper from './wallpaper'
import Menu from "./menu"
import Button from "./button"
import wallpapers from './wallpapers'
import Settings from './settings'
import Bookmarks from './bookmarks'
import icons from "./icons"

class NewTab extends Component {
  constructor(props) {
    super(props)

    this.setState({
      wallpaper: null,
      showBookmarks: true
    })

    this.bookmarks = new Bookmarks()
  }

  render() {
    return (
      <div className={`newtab`}>
        <img src={icons.close} className="close-button" onclick={() => this.setState({ showBookmarks: false })} />
        <div className="center">
          {this.renderBookmarks()}
        </div>
        { this.state.wallpaper ? <Wallpaper {...this.state.wallpaper} /> : null }
        <Settings open={this.state.isSettingsOpen} />
      </div>
    )
  }

  renderBookmarks() {
    return (
      <Bookmarks open={this.state.showBookmarks} wallpaper={this.state.wallpaper} />
    )
  }

  renderSettingsButton() {
    return (
      <Button className="settings" icon={this.state.isSettingsOpen ? "close" : "settings"} onClick={() => this.setState({ isSettingsOpen: !this.state.isSettingsOpen })} />
    )
  }
}

render(<NewTab />, document.body)
