import { h, Component } from "preact"
import URLIcon from "./url-icon"

export default class URLs extends Component {
  constructor(props) {
    super(props)

    this.setState({
      content: [],
      loading: true
    })

    this.recent((error, result) => this.setState({
      loading: false,
      content: result || [],
      error
    }))
  }

  render () {
    return (
      <div className={`urls ${this.name}`}>
        {this.state.content.map(url => <URLIcon {...url} />)}
      </div>
    )
  }
}
