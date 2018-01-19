import { h, Component, render } from "preact"
import Wallpaper from './wallpaper'
import Menu from "./menu"
import Search from './search'
import Logo from './logo'
import Messaging from "./messaging"
import Settings from "./settings"

class NewTab extends Component {
  constructor(props) {
    super(props)
    this.messages = new Messaging()

    this.loadSettings()
    this.checkIfDisabled()
  }

  loadSettings(avoidCache) {
    this.loadSetting('minimalMode', avoidCache)
    this.loadSetting('showWallpaper', avoidCache)
    this.loadSetting('enableGreeting', avoidCache)
    this.loadSetting('recentBookmarksFirst', avoidCache)
  }

  checkIfDisabled() {
    if (localStorage['is-disabled'] == '1') {
      this.showDefaultNewTab()
    }

    this.messages.send({ task: 'get-settings-value', key: 'enableNewTab' }, resp => {
      if (resp.error) {
        return this.setState({ error: resp.error })
      }

      if (!resp.content.value) {
        localStorage['is-disabled'] = "1"
        this.showDefaultNewTab()
      } else {
        localStorage['is-disabled'] = ""
      }
    })
  }

  loadSetting(key, avoidCache) {
    if (!avoidCache && localStorage['settings-cache-' + key]) {
      try {
        this.applySetting(key, JSON.parse(localStorage['settings-cache-' + key]))
      } catch (e) {}
    }

    this.messages.send({ task: 'get-settings-value', key }, resp => {
      if (!resp.error) {
        localStorage['settings-cache-' + key] = JSON.stringify(resp.content.value)
        this.applySetting(key, resp.content.value)
      }
    })
  }

  applySetting(key, value) {
    const u = {}
    u[key] = value
    this.setState(u)
  }

  showDefaultNewTab() {
    if (this.state.disabled) return

    this.setState({
      newTabURL: document.location.href,
      disabled: true
    })

		chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
			var active = tabs[0].id

			chrome.tabs.update(active, {
        url: /firefox/i.test(navigator.userAgent) ? "about:newtab" : "chrome-search://local-ntp/local-ntp.html"
      })
		})
  }

  prevWallpaper() {
    this.setState({
      wallpaperIndex: (this.state.wallpaperIndex || 0) - 1
    })
  }

  nextWallpaper() {
    this.setState({
      wallpaperIndex: (this.state.wallpaperIndex || 0) + 1
    })
  }

  render() {
    if (this.state.disabled) return

    return (
      <div className={`newtab ${this.state.showWallpaper ? "has-wallpaper" : ""} ${this.state.minimalMode ? "minimal" : ""}`}>
        {this.state.minimalMode ? null : <Logo />}
        <Settings onChange={() => this.loadSettings(true)} messages={this.messages} type="newtab" />
        <Search recentBookmarksFirst={this.state.recentBookmarksFirst} nextWallpaper={() => this.nextWallpaper()} prevWallpaper={() => this.prevWallpaper()} enableGreeting={this.state.enableGreeting} settings={this.settings} />
        { this.state.showWallpaper ? <Wallpaper index={this.state.wallpaperIndex} messages={this.messages} /> : null }
      </div>
    )
  }
}

render(<NewTab />, document.body)
