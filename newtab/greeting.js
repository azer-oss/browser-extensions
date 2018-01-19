import { h, Component } from "preact"


export default class Greeting extends Component {
  componentWillMount() {
    this.props.messages.send({ task: 'get-name' }, resp => {
      if (resp.error) return this.onError(resp.error)

      this.setState({
        name: resp.content.name
      })
    })

    this.tick()
  }

  componentWillUnmount() {
    this.deleteTimer()
  }

  deleteTimer() {
    if (this.timer !== undefined) {
      clearTimeout(this.timer)
      this.timer = undefined
    }
  }

  setTimer() {
    this.deleteTimer()
    this.timer = setTimeout(() => this.tick(), 60000)
  }

  tick() {
    const now = new Date()

    this.setState({
      hours: now.getHours(),
      minutes: now.getMinutes()
    })

    this.setTimer()
  }

  onError(error) {
    console.error(error)
  }

  render() {
    return (
      <div className="greeting">
        {this.renderMessage()}
        {this.renderTime()}
      </div>
    )
  }

  renderTime() {
    return (
      <div className="time">
        {pad(this.state.hours)}:{pad(this.state.minutes)}
      </div>
    )
  }

  renderMessage() {
    const hour = this.state.hours
    let message = "Good morning"

    if (hour >= 12) message = "Good Afternoon"
    if (hour >= 16) message = "Good Evening"

    message += (this.state.name ? "," : ".")

    return (
      <div className="message">
        {message}
        {this.renderName()}
      </div>
    )
  }

  renderName() {
    if (!this.state.name) return

    return (
      <div className="name">
        {this.state.name.slice(0, 1).toUpperCase() + this.state.name.slice(1)}.
      </div>
    )
  }
}

function pad (n) {
  if (String(n).length < 2) {
    return '0' + n
  }

  return n
}
