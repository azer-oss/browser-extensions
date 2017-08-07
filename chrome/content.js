import ContentMessageProxy from './content-message-proxy'
const proxy = new ContentMessageProxy()

console.log('send message')
proxy.send({
  'from': 'kozmos:content-message-proxy',
  'to': 'kozmos:background',
  'content': {
    'task': 'set-token',
    'token': localStorage['token']
  }
})
