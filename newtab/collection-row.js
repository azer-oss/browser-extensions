import Row from "./row"

export default class CollectionRow extends Row {
  buttons() {
    const rename = {
      title: "Rename",
      icon: "settings",
      action: ({ update, sendMessage }) => {
        const title = prompt("title", this.title)

        console.log(title, this.title)
        if (title === this.title) return

        sendMessage(
          { task: "update-collection", titleToUpdate: this.title, title },
          () => {
            console.log("response received")
            this.title = title
            update()
          }
        )
      }
    }

    const remove = {
      title: "Remove",
      icon: "Trash",
      action: ({ update, sendMessage }) => {
        const yes = confirm(
          `Are you sure you want to delete the collection "${this.title}" ?`
        )
        if (!yes) return

        sendMessage({ task: "delete-collection", title: this.title }, () => {
          update()
        })
      }
    }

    return [rename, remove]
  }

  onClick() {
    this.category.results.props.openCollection(this.title)
  }

  renderDesc() {
    return this.desc || `Links under "${this.title}" collection`
  }
}
