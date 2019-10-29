import { h, Component } from "preact"
import Input from "./input"
import Icon from "./icon"
import Messaging from "./messaging"

export default class SpeedDial extends Component {
  constructor(props) {
    super(props)
    this.messages = new Messaging()

    this.setState({
      value: undefined
    })

    this.load()
  }

  async load() {
    try {
      const current = await this.getCurrentSpeedDial(this.props.like.url)
      this.setState({
        value: current ? current.key : ""
      })
    } catch (err) {
      this.setState({
        value: ""
      })
    }
  }

  async setValue(value) {
    this.setState({
      value
    })

    const current = await this.getCurrentSpeedDial(this.props.like.url)
    if (current) {
      await this.removeSpeedDial(current)
    }

    value = value.trim()

    if (value.length) {
      await this.addToSpeedDial(value)
    }

    this.props.onSave()
  }

  async onPressEsc() {
    const current = await this.getCurrentSpeedDial()

    this.setState({
      value: current.key
    })
  }

  getCurrentSpeedDial() {
    return new Promise((resolve, reject) => {
      this.messages.send(
        {
          task: "get-current-speed-dial",
          url: this.props.like.url
        },
        resp => {
          if (resp.error) return reject(resp.error)
          resolve(resp.content.speedDial)
        }
      )
    })
  }

  addToSpeedDial(key) {
    return new Promise((resolve, reject) => {
      this.messages.send(
        {
          task: "add-to-speed-dial",
          url: this.props.like.url,
          key
        },
        resp => {
          if (resp.error) return reject(resp.error)
          resolve()
        }
      )
    })
  }

  removeSpeedDial() {
    return new Promise((resolve, reject) => {
      this.messages.send(
        {
          task: "remove-speed-dial",
          url: this.props.like.url
        },
        resp => {
          if (resp.error) return reject(resp.error)
          resolve()
        }
      )
    })
  }

  render() {
    return (
      <div className="speed-dial textfield">
        {this.state.value === undefined ? null : (
          <Input
            placeholder="Enter a speed dial keyword"
            onPressEnter={value => this.setValue(value)}
            onPressEsc={() => this.onPressEsc()}
            value={this.state.value}
            autofocus
          />
        )}
      </div>
    )
  }
}
