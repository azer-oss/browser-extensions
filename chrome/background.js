import BackgroundTasks from './background-tasks'
import { listenForChanges as initializeLikeIcon } from './icons'
import * as auth from '../lib/auth'
import * as db from '../lib/db'

setupDBAuth()
initializeLikeIcon()
new BackgroundTasks()

// Check if user still use API token instead of key & secret
function setupDBAuth () {
  const deprecatedToken = auth.getDeprecatedToken()
  const user = auth.read()

  if (deprecatedToken) {
    db.setDeprecatedToken(auth.getDeprecatedToken())
  }

  if (deprecatedToken && !user) {
    auth.refresh(() => console.log('Refreshed user info on client-side'))
    return
  }

  if (user) {
    db.setAPIAccessToken(user.access_token.key, user.access_token.secret)
  }
}
