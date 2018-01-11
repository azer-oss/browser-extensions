import { h, Component } from "preact"

export default class Icon extends Component {
  render() {
    const method = this['render' + this.props.name.slice(0, 1).toUpperCase(0, 1) + this.props.name.slice(1)]

    return (
      <div onClick={this.props.onClick} className={`icon icon-${this.props.name}`} {...this.props}>
        {method ? method.call(this) : null}
      </div>
    )
  }

  stroke () {
    return this.props.stroke || 2
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
      <svg id="i-heart" viewBox="0 0 32 32" width="32" height="32" fill="currentcolor" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width={this.stroke()}>
        <path d="M4 16 C1 12 2 6 7 4 12 2 15 6 16 8 17 6 21 2 26 4 31 6 31 12 28 16 25 20 16 28 16 28 16 28 7 20 4 16 Z" />
      </svg>
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

  renderRightChevron() {
    return (
      <svg id="i-chevron-right" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width={this.props.stroke || "2"}>
        <path d="M12 30 L24 16 12 2" />
      </svg>
    )
  }

  renderSettings() {
    return (
      <svg id="i-settings" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width={this.props.stroke || "2"}>
        <path d="M13 2 L13 6 11 7 8 4 4 8 7 11 6 13 2 13 2 19 6 19 7 21 4 24 8 28 11 25 13 26 13 30 19 30 19 26 21 25 24 28 28 24 25 21 26 19 30 19 30 13 26 13 25 11 28 8 24 4 21 7 19 6 19 2 Z" />
        <circle cx="16" cy="16" r="4" />
      </svg>
    )
  }

  renderMessage() {
    return (
      <svg id="i-msg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width={this.props.stroke || "2"}>
        <path d="M2 4 L30 4 30 22 16 22 8 29 8 22 2 22 Z" />
      </svg>
    )
  }
}
