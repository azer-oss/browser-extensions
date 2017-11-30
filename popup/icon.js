import { h, Component } from "preact"

export default class Icon extends Component {
  render() {
    const method = this['render' + this.props.name.slice(0, 1).toUpperCase(0, 1) + this.props.name.slice(1)].bind(this)

    if (method) {
      return (
        <div className={`icon icon-${this.props.name}`} {...this.props}>
          {method()}
        </div>
      )
    }
  }

  renderAlert() {
    return (
      <svg id="i-alert" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width={this.props.stroke || "2"}>
        <path d="M16 3 L30 29 2 29 Z M16 11 L16 19 M16 23 L16 25" />
      </svg>
    )
  }

  renderClock() {
    return (
      <svg id="i-clock" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width={this.props.stroke || "2"}>
        <circle cx="16" cy="16" r="14" />
        <path d="M16 8 L16 16 20 20" />
      </svg>
    )
  }

  renderClose() {
    return (
      <svg id="i-close" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width={this.props.stroke || "2"}>
        <path d="M2 30 L30 2 M30 30 L2 2" />
      </svg>
    )
  }

  renderHeart() {
    return (
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmBAMAAABaE/SdAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAtUExURUdwTP///////////////////////////////////////////////////////81e3QIAAAAOdFJOUwAPbsnztB2e4C4/VoZ5zGlfVgAAAOlJREFUKBVjYKATWFNalAC0iut4+E2YjRrv3r17OoGBuw9IW0EEhYHMd+/eMsaB6QMgQcY+MPvdYQj1HCTGCmHDSQWg2D44D8JwBIrZoYm9ZWBgQxN695iBgRtd7B0DAxOGWAIDL4bYBKzquNDVPQF6A10MaC829zHooSl8BlQngSZWABRDc/STBKAYmoGPQEJomgPAYpx+SCY+FgCLMSxBEjOECDFwIRTClDEwzIArLIQqA/ovDioIDGM4YILofjEBLgJkTAYrROgEy50DCnYjqwKyufrePU1AE2MQf6KALsTAsBNTiIAIAAc4W+eLBa54AAAAAElFTkSuQmCC" />
    )
  }

  renderSearch() {
    return (
      <svg id="i-search" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width={this.props.stroke || "2"}>
        <circle cx="14" cy="14" r="12" />
        <path d="M23 23 L30 30"  />
      </svg>
    )
  }

  renderExternal() {
    return (
      <svg id="i-external" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width={this.props.stroke || "2"}>
        <path d="M14 9 L3 9 3 29 23 29 23 18 M18 4 L28 4 28 14 M28 4 L14 18" />
      </svg>
    )
  }

  renderTag() {
    return (
      <svg id="i-tag" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width={this.props.stroke || "2"}>
        <circle cx="24" cy="8" r="2" />
        <path d="M2 18 L18 2 30 2 30 14 14 30 Z" />
      </svg>
    )
  }

  renderTrash() {
    return (
      <svg id="i-trash" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width={this.props.stroke || "2"}>
        <path d="M28 6 L6 6 8 30 24 30 26 6 4 6 M16 12 L16 24 M21 12 L20 24 M11 12 L12 24 M12 6 L13 2 19 2 20 6" />
      </svg>
    )
  }

  renderOptions() {
    return (
      <svg id="i-options" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width={this.props.stroke || "2"}>
        <path d="M28 6 L4 6 M28 16 L4 16 M28 26 L4 26 M24 3 L24 9 M8 13 L8 19 M20 23 L20 29" />
      </svg>
    )
  }
}
