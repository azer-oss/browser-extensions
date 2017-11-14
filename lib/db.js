import likedb from "likedb"
import pubsub from "pubsub"
import config from "../config"

export const onError = pubsub()
export const onPostUpdates = pubsub()
export const onReceiveUpdates = pubsub()

export const db = likedb({
  host: config.host,
  token: "",
  postIntervalSecs: 1.5,
  pushIntervalSecs: 10,
  onPostUpdates: () => onPostUpdates.publish(),
  onReceiveUpdates: () => onReceiveUpdates.publish(),
  onError: (error, action) => onError.publish(error, action)
})

export function setToken (token) {
  console.info('Setting likedb token')
  db.servers.token = token
}

export function isTokenSet () {
  return db.servers.token !== ""
}
