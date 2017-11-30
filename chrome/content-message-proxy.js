import Messaging from "../lib/messaging"
import config from '../config'

export default class ContentMessageProxy extends Messaging {
  constructor() {
    super()
    this.name = 'kozmos:content-message-proxy'
  }

  listenForMessages() {
    chrome.runtime.onMessage.addListener(msg => this.onReceive(msg))
    addEventListener("message", event => this.onReceive(event.data))
  }

  onReceive(msg) {
    if (msg.proxy === this.name) return
    if (msg.to === this.name) return super.onReceive(msg)
    this.sendMessage(msg)
  }

  sendMessageToWeb(msg) {
    msg.proxy = this.name
    postMessage(msg, config.host)
  }

  sendMessageToBackground(msg) {
    msg.proxy = this.name
    chrome.runtime.sendMessage(msg)
  }

  sendMessage(msg) {
    if (msg.to === 'kozmos:web') return this.sendMessageToWeb(msg)
    if (msg.to === 'kozmos:background') return this.sendMessageToBackground(msg)
  }

  send (msg, callback) {
    if (msg.from === this.name) return super.send(msg, callback)
    msg.proxy = this.name
    this.sendMessage(msg)
  }
}
