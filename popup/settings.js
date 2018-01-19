import { h, Component } from "preact"
import NewTabSettings from "../newtab/settings"

export default class Settings extends NewTabSettings {
  render() {
    return (
      <div className="settings">
        <h2>Settings</h2>
        {this.renderSections()}
      </div>
    )
  }
}
