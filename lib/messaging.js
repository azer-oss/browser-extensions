let messageCounter = 0

export const DEFAULT_TIMEOUT_SECS = 5

export default class Messaging {
  constructor() {
    this.listenForMessages()
    this.waiting = {}
  }

  draft({ id, content, error, to, reply }) {
    id = this.generateId()

    return {
      from: this.name,
      to: to || this.target,
      error: content.error || error,
      id, content, reply
    }
  }

  generateId() {
    return (Date.now() * 1000) + (++messageCounter)
  }

  onReceive(msg) {
    if (msg.to !== this.name) return true

    if (msg.reply && this.waiting[msg.reply]) {
      this.waiting[msg.reply](msg)
    }

    if (msg.reply) {
      return true
    }

    if (msg.content && msg.content.ping) {
      this.reply(msg, { pong: true })
      return true
    }
  }

  ping(callback) {
    this.send({ ping: true }, callback)
  }

  reply(msg, options) {
    if (!options.content) {
      options = {
        content: options
      }
    }

    options.reply = msg.id
    options.to = msg.from

    this.send(options)
  }

  send(options, callback) {
    const msg = this.draft(options.content ? options : { content: options })

    this.sendMessage(msg)

    if (callback) {
      this.waitReplyFor(msg.id, DEFAULT_TIMEOUT_SECS, callback)
    }
  }

  waitReplyFor(msgId, timeoutSecs, callback) {
    const self = this
    let timeout = undefined

    if (timeoutSecs > 0) {
      timeout = setTimeout(onTimeout, timeoutSecs * 1000)
    }

    this.waiting[msgId] = msg => {
      done()
      callback(msg)
    }

    return done

    function done () {
      if (timeout != undefined) {
        clearTimeout(timeout)
      }

      timeout = undefined
      delete self.waiting[msgId]
    }

    function onTimeout () {
      done()
      callback({ error: new Error('Message response timeout (' + timeoutSecs +')s.') })
    }
  }
}
