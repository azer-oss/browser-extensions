import BackgroundTasks from "./background-tasks"
import { listenForChanges as initializeLikeIcon } from "./icons"
import * as auth from "../lib/auth"
import * as db from "../lib/db"

setupDBAuth()
initializeLikeIcon()
new BackgroundTasks()

function setupDBAuth() {
  const user = auth.read()

  if (user) {
    db.setAPIAccessToken(user.access_token.key, user.access_token.secret)
  }
}
