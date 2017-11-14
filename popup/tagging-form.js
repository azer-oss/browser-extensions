import { h, Component } from "preact"
import Input from "./input"
import Icon from "./icon"
import api from "../lib/api"

export default class TaggingForm extends Component {
  constructor(props) {
    super(props)
    this.load()
  }

  componentWillReceiveProps(props) {
    super.componentWillReceiveProps(props)
    this.load()
  }

  load() {
    this.setState({
      isLoading: true,
      tags: []
    })

    api.post("/api/like-tags", { "url": this.props.like.url }, (err, resp) => {
      if (err) return this.setState({ error: err, isLoading: false })

      this.setState({
        tags: resp.tags,
        isLoading: false
      })
    })
  }

  addTag(tag) {
    this.setState({
      isLoading: true
    })

    api.put('/api/like-tags', { tags: [tag], url: this.props.like.url }, err => {
      if (err) return this.setState({ error: err, isLoading: false })

      this.load()
    })
  }

  deleteTag(tag) {
    this.setState({
      isLoading: true
    })

    api.delete('/api/like-tags', { tag: tag, url: this.props.like.url }, err => {
      if (err) return this.setState({ error: err, isLoading: false })

      this.load()
    })
  }

  render() {
    return (
      <div className="tagging-form">
        <Input onPressEnter={value => this.addTag(value)} icon="tag" placeholder="Type a tag & hit enter" />
        {this.renderTags()}
      </div>
    )
  }

  renderLoading() {
    return (
      <div className="loading">
        Loading...
      </div>
    )
  }

  renderTags() {
    if (this.state.isLoading) return this.renderLoading()
    if (this.state.tags.length == 0) return

    return (
      <div className="tags">
        {this.state.tags.map(t => this.renderTag(t))}
      </div>
    )
  }

  renderTag(tag) {
    return (
      <div className="tag">
        {tag.name}
        <Icon name="close" stroke="5" title={`Delete "${tag.name}"`} onclick={() => this.deleteTag(tag.name)} />
      </div>
    )
  }
}
