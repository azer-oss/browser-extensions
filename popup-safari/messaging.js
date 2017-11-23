export default class Messaging {
  constructor() {}

  listenForMessages(callback) {
    safari.application.addEventListener("message", callback)
  }

  send(msg, callback) {
    safari.self.tab.dispatchMessage(msg.task, msg.data)
    if (callback) {
      listenForMessages(callback)
    }
  }
}
