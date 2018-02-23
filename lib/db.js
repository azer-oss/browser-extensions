import likedb from "likedb"
import pubsub from "pubsub"
import config from "../config"

export const onError = pubsub()
export const onPostUpdates = pubsub()
export const onReceiveUpdates = pubsub()

export const db = likedb({
  host: config.host,
  postIntervalSecs: 1.5,
  pushIntervalSecs: 10,
  onPostUpdates: () => onPostUpdates.publish(),
  onReceiveUpdates: () => onReceiveUpdates.publish(),
  onError: (error, action) => onError.publish(error, action)
})

export function setDeprecatedToken (token) {
  console.info('Setting deprecated likedb token')
  db.servers.deprecatedToken = token
}

export function setAPIAccessToken (key, secret) {
  console.info('Setting likedb API access token')
  db.servers.apiKey = key
  db.servers.apiSecret = secret
}
