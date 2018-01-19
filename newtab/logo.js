import { h, Component } from "preact"

export default class Logo extends Component {
  render() {
    return (
      <a className="logo" href="https://getkozmos.com">
        <img src={chrome.extension.getURL("images/icon128.png")} title="Open Kozmos" />
      </a>
    )
  }
}
