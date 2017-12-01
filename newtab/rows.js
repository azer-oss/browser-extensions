import { h, Component } from "preact"
import URLIcon from "./url-icon"

export default class Rows extends Component {
  constructor(props) {
    super(props)
    this.setState({ rows: [] })
    this.update(props.query)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.query !== nextProps.query || !this.state.rows || this.state.rows.length !== nextState.rows.length) {
      return true
    }

    if ((!this.props.selected && nextProps.selected) || (this.props.selected && !nextProps.selected) || (this.props.selected && nextProps.selected && this.props.selected.id !== nextProps.selected.id)) {
      return true
    }

    let i = Math.min(5, this.state.rows.length);
    while (i--) {
      if (this.state.rows[i].url !== nextState.rows[i].url) {
        return true
      }
    }
    return false
  }

  componentWillReceiveProps(props) {
    if (this.props.query !== props.query) {
      this.update(props.query)
    }
  }

  mapEach(row) {
    row.type = this.name
    row.id = this.props.id(row)
    this.props.mapRow(row)
    return row
  }

  max(count) {
    return this.props.reserveRows(count, this.type)
  }

  render() {
    if (this.state.rows.length === 0) return

    return (
      <div className="rows">
        {this.title ? <div className="title">
          <h1>{this.title}</h1>
        </div> : null }
        <div className='rows-content'>
          {this.state.rows.map((row) => this.renderRow(row))}
        </div>
      </div>
    )
  }

  renderRow(row) {
    if (!this.props.selected && row.id === 1) {
      this.props.onSelect(row)
    }

    return (
      <URLIcon content={row}
               onSelect={this.props.onSelect}
               selected={this.props.selected && this.props.selected.id == row.id}
               />
    )
  }
}
