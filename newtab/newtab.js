import { h, Component, render } from "preact"
import Wallpaper from './wallpaper'
import Menu from "./menu"
import wallpapers from './wallpapers'
import Search from './search'
import Logo from './logo'
import Settings from './settings'

class NewTab extends Component {
  constructor(props) {
    super(props)

    this.setState({
      wallpaper: null
    })
  }

  render() {
    return (
      <div className={`newtab`}>
        <Logo />
        <div className="center">
          <Search />
        </div>
        { this.state.wallpaper ? <Wallpaper {...this.state.wallpaper} /> : null }
      </div>
    )
  }
}

render(<NewTab />, document.body)
