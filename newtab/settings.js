import { h, Component } from "preact"
import Icon from "./icon"
import sections from '../chrome/settings-sections'

export default class Settings extends Component {
  constructor(props) {
    super(props)

    sections.forEach(s => this.loadSection(s))
  }

  componentWillReceiveProps() {
    sections.forEach(s => this.loadSection(s))
  }

  loadSection(s) {
    this.props.messages.send({ task: 'get-settings-value', key: s.key }, resp => {
      if (resp.error) return this.onError(resp.error)
      const u = {}
      u[s.key] = resp.content.value
      this.setState(u)
    })
  }

  onChange(value, options) {
    this.props.messages.send({ task: 'set-settings-value', key: options.key, value }, resp => {
      if (resp.error) return this.onError(resp.error)

      if (this.props.onChange) {
        this.props.onChange()
      }
    })
  }

  onError(error) {
    this.setState({
      error
    })

    if (this.props.onError) {
      this.props.onError(error)
    }
  }

  render() {
    return (
      <div className={`settings ${this.state.open ? "open" : ""}`}>
        <Icon onClick={() => this.setState({ open: true })} name="settings" />
        {this.renderSettings()}
      </div>
    )
  }

  renderSettings() {
    return (
      <div className="content">
        {this.renderCloseButton()}
        <h1>Settings</h1>
        <h2>Got feedback / recommendation ? <a href="mailto:azer@getkozmos.com">feedback</a> anytime.</h2>
        {this.renderSections()}
        <div className="footer">
          <button onclick={() => this.setState({ open: false })}>
            Done
          </button>
        </div>
      </div>
    )
  }

  renderSections() {
    return (
      <div className="sections">
        {sections.map(s => this.renderSection(s))}
      </div>
    )
  }

  renderSection(options) {
    if (this.props.type && !options[this.props.type]) {
      return
    }

    return (
      <section className={`setting ${options.key}`}>
        <input className="checkbox" id={options.key} name={options.key} type="checkbox" checked={this.state[options.key]} onChange={e => this.onChange(e.target.checked, options)} />
        <label title={options.desc} htmlFor={options.key}>{options.title}</label>
        <p>{options.desc}</p>
      </section>
    )
  }

  renderCloseButton() {
    return (
      <Icon stroke="3" name="close" onClick={() => this.setState({ open: false })} />
    )
  }
}
