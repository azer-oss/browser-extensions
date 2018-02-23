import { h, Component } from "preact"
import Input from "./input"
import Icon from "./icon"
import Messaging from "./messaging"

export default class TaggingForm extends Component {
  constructor(props) {
    super(props)

    this.messages = new Messaging()
    this.load()
    this.setState({
      isLoading: true,
      tags: []
    })
  }

  componentWillReceiveProps(props) {
    if (this.props.like.url !== props.like.url) {
      this.setState({
        isLoading: true,
        tags: []
      })
      this.load()
    }
  }

  load() {
    this.props.onStartLoading()

    this.messages.send({ task: 'get-tags', url: this.props.like.url }, resp => {
      this.props.onStopLoading()

      if (resp.error) return this.props.onError(resp.error)

      this.setState({
        tags: resp.content.tags,
        isLoading: false
      })
    })
  }

  addTag(tag) {
    this.props.onStartLoading()

    const tags = tag.split(/,\s*/)

    this.messages.send({ task: 'add-tags', tags, url: this.props.like.url }, resp => {
      this.props.onStopLoading()
      if (resp.error) return this.props.onError(resp.error)
      this.load()
    })

    const copy = this.state.tags.slice()
    copy.push.apply(copy, tags)
    this.setState({ tags: copy })
  }

  deleteTag(tag) {
    this.props.onStartLoading()

    this.messages.send({ task: 'delete-tag', tag, url: this.props.like.url }, resp => {
      this.props.onStopLoading()
      if (resp.error) return this.props.onError(resp.error)
      this.load()
    })

    const copy = this.state.tags.slice()
    let index = -1

    let i = copy.length
    while (i--) {
      if (copy[i] === tag || copy[i].name == tag) {
        index = i;
        break;
      }
    }

    if (index > -1) {
      copy.splice(index, 1)
      this.setState({ tags: copy })
    }
  }

  render() {
    return (
      <div className="tagging-form">
        <Input onPressEnter={value => this.addTag(value)} onTypeComma={value => this.addTag(value)} icon="tag" placeholder="Type a tag & hit enter" autofocus />
        {this.renderTags()}
      </div>
    )
  }

  renderTags() {
    if (this.state.tags.length == 0) return

    return (
      <div className="tags">
        {this.state.tags.map(t => this.renderTag(t))}
      </div>
    )
  }

  renderTag(tag) {
    if (typeof tag === 'string') {
      tag = { name: tag }
    }

    return (
      <div className="tag">
        <Icon name="close" stroke="5" title={`Delete "${tag.name}"`} onclick={() => this.deleteTag(tag.name)} />
        {tag.name}
      </div>
    )
  }
}
