import Row from "./row"

export default class CollectionRow extends Row {
  onClick() {
    this.category.results.props.openCollection(this.title)
  }

  renderDesc() {
    return this.desc || `Links under "${this.title}" collection`
  }
}
