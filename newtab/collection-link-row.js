import Row from "./row"

export default class CollectionLinkRow extends Row {
  buttons() {
    const coll = this.category.collection
    console.log(coll)

    const remove = {
      title: "Remove from collection",
      icon: "Trash",
      action: ({ update, sendMessage }) => {
        const yes = confirm(
          `Are you sure you want to delete this link from the collection "${coll}" ?`
        )
        if (!yes) return

        sendMessage(
          {
            task: "remove-from-collection",
            url: this.url,
            collection: coll
          },
          () => {
            update()
          }
        )
      }
    }

    return [remove]
  }
}
