import { h, Component } from "preact"

export default class Menu extends Component {
  setTitle(title) {
    this.setState({ title })
  }

  render() {
    return (
      <div className="menu">
        <div className="title">
          {this.state.title || ""}
        </div>
        <ul className="buttons">
          <li>
            <Button
              icon="calendar"
              onMouseOver={() => this.setTitle('Recently Visited')}
              onMouseOut={() => this.setTitle()}
              onClick={() => this.props.openRecent()} />
          </li>
          <li>
            <Button
              icon="heart"
              onMouseOver={() => this.setTitle('Bookmarks')}
              onMouseOut={() => this.setTitle()}
              onClick={() => this.props.openBookmarks()} />
          </li>
          <li>
            <Button
               icon="fire"
               onMouseOver={() => this.setTitle('Most Visited')}
               onMouseOut={() => this.setTitle()}
               onClick={() => this.props.openTop()} />
          </li>
        </ul>
      </div>
    )
  }
}
