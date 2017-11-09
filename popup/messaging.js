import Messaging from '../lib/messaging'

export default class FromPopupToBackground extends Messaging {
  constructor() {
    super()
    this.name = 'kozmos:popup'
    this.target = 'kozmos:background'
  }

  listenForMessages() {
    chrome.runtime.onMessage.addListener(msg => this.onReceive(msg))
  }

  sendMessage (msg, callback) {
    chrome.runtime.sendMessage(msg, callback)
  }
}
