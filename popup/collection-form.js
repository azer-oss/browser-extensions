import { h, Component } from "preact"
import Input from "./input"
import Icon from "./icon"
import Messaging from "./messaging"

export default class CollectionForm extends Component {
  constructor(props) {
    super(props)

    this.messages = new Messaging()
    this.setState({
      isLoading: true,
      editing: !this.props.value,
      collection: this.props.value
    })

    this.getCurrentCollection().then(collection => {
      if (collection) {
        this.setState({ collection: collection.title, editing: false })
      }
    })
  }

  componentWillReceiveProps(props) {
    if (this.props.collection !== props.collection) {
      this.setState({
        isLoading: true,
        collection: props.collection
      })
      this.load()
    }
  }

  hasSuggestions() {
    return this.state.suggestions && this.state.suggestions.length
  }

  async setCollection(collection) {
    this.setState({ suggestions: null, collection, editing: false })

    const current = await this.getCurrentCollection()
    if (current) {
      await this.removeFromCollection(current.title)
    }

    collection = collection.trim()

    if (collection.length) {
      await this.addToCollection(collection)
    }

    this.props.onSave()
  }

  onPressEsc(e) {
    this.setState({
      suggestions: null,
      editing: false
    })
  }

  getCurrentCollection() {
    return new Promise((resolve, reject) => {
      this.messages.send(
        {
          task: "get-collections-of-url",
          url: this.props.like.url
        },
        resp => {
          if (resp.error) return reject(resp.error)
          resolve(resp.content.collections[0] || null)
        }
      )
    })
  }

  getRecentCollections() {
    return new Promise((resolve, reject) => {
      this.messages.send(
        {
          task: "get-recent-collections"
        },
        resp => {
          if (resp.error) return reject(resp.error)
          resolve(resp.content.collections.map(c => c.title))
        }
      )
    })
  }

  removeFromCollection(collection) {
    return new Promise((resolve, reject) => {
      this.messages.send(
        {
          task: "remove-from-collection",
          url: this.props.like.url,
          collection
        },
        resp => {
          if (resp.error) return reject(resp.error)
          resolve()
        }
      )
    })
  }

  addToCollection(collection) {
    return new Promise((resolve, reject) => {
      this.messages.send(
        {
          task: "add-to-collection",
          url: this.props.like.url,
          collection
        },
        resp => {
          if (resp.error) return reject(resp.error)
          resolve()
        }
      )
    })
  }

  async suggest(input) {
    input = input.trim()
    if (!input) {
      const recent = await this.getRecentCollections()
      this.setState({ suggestions: recent })
    }

    this.messages.send({ task: "suggest-collections", query: input }, resp => {
      if (resp.error) return this.props.onError(resp.error)

      this.setState({
        suggestions: resp.content.suggestions
          .filter(c => this.state.collection !== c)
          .map(c => c.title)
          .slice(0, 3)
      })
    })
  }

  render() {
    return <div className="collection-form">{this.renderInput()}</div>
  }

  renderInput() {
    return (
      <div
        className={`collection-editor textfield selectfield ${
          this.hasSuggestions() ? "has-suggestions" : ""
        }`}
      >
        <Icon
          onClick={() => this.startEditing()}
          stroke="2"
          name="rightChevron"
        />
        {this.renderContent()}
      </div>
    )
  }

  renderContent() {
    if (this.state.collection && this.state.editing == false) {
      return this.renderExistingValue()
    }

    return (
      <Input
        onPressEsc={() => this.onPressEsc()}
        onPressEnter={value => this.setCollection(value)}
        onChange={value => this.suggest(value)}
        placeholder="Choose or create a collection"
        value={this.state.collection}
        suggestions={this.state.suggestions}
        autofocus
      />
    )
  }

  renderExistingValue() {
    return (
      <div className="existing" onClick={() => this.startEditing()}>
        {this.state.collection}
      </div>
    )
  }

  renderSuggestion(suggestion) {
    if (typeof suggestion === "string") {
      suggestion = { name: suggestion }
    }

    return (
      <div
        className="tag"
        title={`Remove from ${suggestion.name}`}
        onclick={() => this.deleteTag(suggestion.name)}
      >
        {suggestion.name}
        <div className="remove" />
      </div>
    )
  }

  async startEditing() {
    this.setState({ editing: true })
    const recent = await this.getRecentCollections()
    this.setState({
      suggestions: recent.filter(c => this.state.collection !== c)
    })
  }
}

a = {
  content: [
    {
      action: "add",
      store: "collections",
      documentId: "Photos",
      doc: {
        id: 1572098469947,
        title: "Photos",
        desc: "",
        createdAt: 1572098469947,
        updatedAt: 1572098469947,
        normalizedTitle: "photos"
      },
      id: 92
    },
    {
      action: "add",
      store: "collection-links",
      documentId: "Photos:https://kodfabrik.com/photo/37235621400",
      doc: {
        key: "Photos:https://kodfabrik.com/photo/37235621400",
        collection: "Photos",
        url: "https://kodfabrik.com/photo/37235621400",
        createdAt: 1572098469949,
        updatedAt: 1572098469949
      },
      id: 93
    }
  ]
}
