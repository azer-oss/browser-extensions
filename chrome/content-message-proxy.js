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
    this.sendMessage(msg)
  }

  sendMessageToWeb(msg) {
    postMessage(msg, config.host)
  }

  sendMessageToBackground(msg) {
    chrome.runtime.sendMessage(msg)
  }

  sendMessage(msg) {
    if (msg.to === 'kozmos:web') return this.sendMessageToWeb(msg)
    if (msg.to === 'kozmos:background') return this.sendMessageToBackground(msg)
  }

  send (msg) {
    msg.proxy = this.name
    this.sendMessage(msg)
  }
}
