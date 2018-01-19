import Messaging from "./messaging"

export default class RemoteTasks extends Messaging {
  onReceive(msg) {
    if (super.onReceive(msg)) {
      return
    }

    console.log('New task: %s', msg.content.task)

    if (this.routes[msg.content.task]) {
      this.routes[msg.content.task](msg)
      return
    }

    this.reply(msg, {
      error: 'Unrecognized task ' + msg.content.task
    })
  }

  map(routes) {
    this.routes = {}

    for (let key in routes) {
      this.routes[key] = routes[key].bind(this)
    }
  }
}
