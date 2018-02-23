import ContentMessageProxy from './content-message-proxy'

// Initialize a message proxy. This simply takes messages from the web page,
// sends them to background.
const proxy = new ContentMessageProxy()

proxy.send({
  'from': 'kozmos:content-message-proxy',
  'to': 'kozmos:background',
  'content': {
    'task': 'set-user',
    'user': localStorage['user']
  }
})
