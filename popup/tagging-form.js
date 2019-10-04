import { h, Component } from "preact"
import Input from "./input"
import Icon from "./icon"
import Messaging from "./messaging"

export default class TaggingForm extends Component {
  constructor(props) {
    super(props)

    this.messages = new Messaging()
    this.setState({
      isLoading: true,
      tags: this.props.like.tags || []
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

  addTag(tag) {
    const tags = tag.split(/\s*,\s*/).filter(s => s.trim().length)

    if (tags.length === 0) {
      return
    }

    this.messages.send(
      { task: "add-tags", tags, url: this.props.like.url },
      resp => {
        if (resp.error) return this.props.onError(resp.error)
      }
    )

    const copy = this.state.tags.slice()
    copy.push.apply(copy, tags)
    this.setState({ tags: copy })

    this.setState({ suggestions: null })
  }

  deleteTag(tag) {
    this.messages.send(
      { task: "delete-tag", tag, url: this.props.like.url },
      resp => {
        if (resp.error) return this.props.onError(resp.error)
      }
    )

    const copy = this.state.tags.slice()
    let index = -1

    let i = copy.length
    while (i--) {
      if (copy[i] === tag || copy[i].name == tag) {
        index = i
        break
      }
    }

    if (index > -1) {
      copy.splice(index, 1)
      this.setState({ tags: copy })
    }
  }

  hasSuggestions() {
    return this.state.suggestions && this.state.suggestions.length
  }

  suggest(input) {
    input = input.trim()
    if (!input) return this.setState({ suggestions: null })

    this.messages.send({ task: "suggest-tags", query: input }, resp => {
      if (resp.error) return this.props.onError(resp.error)

      this.setState({
        suggestions: resp.content.suggestions
          .filter(t => this.state.tags.indexOf(t) === -1)
          .slice(0, 3)
      })
    })
  }

  render() {
    return <div className="tagging-form">{this.renderInput()}</div>
  }

  renderInput() {
    return (
      <div
        className={`tag-editor ${
          this.hasSuggestions() ? "has-suggestions" : ""
        }`}
      >
        {this.renderTags()}
        <Input
          onPressEnter={value => this.addTag(value)}
          onChange={value => this.suggest(value)}
          placeholder="Type a tag & hit enter"
          suggestions={this.state.suggestions}
          autofocus
        />
      </div>
    )
  }

  renderTags() {
    if (this.state.tags.length == 0) return

    return (
      <div className="tags">{this.state.tags.map(t => this.renderTag(t))}</div>
    )
  }

  renderTag(tag) {
    if (typeof tag === "string") {
      tag = { name: tag }
    }

    return (
      <div
        className="tag"
        title={`Untag ${tag.name}`}
        onclick={() => this.deleteTag(tag.name)}
      >
        {tag.name}
        <div className="remove" />
      </div>
    )
  }
}
