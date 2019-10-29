import LikeDB from "likedb"
import syncWithKozmos from "likedb/dist/kozmos"
import pubsub from "pubsub"
import config from "../config"

export const onError = pubsub()
export const onPostUpdates = pubsub()
export const onReceiveUpdates = pubsub()

export const db = new LikeDB()
export const sync = syncWithKozmos(db, {
  host: config.host,
  postIntervalSecs: 1.5,
  pushIntervalSecs: 10,
  onPostUpdates: () => onPostUpdates.publish(),
  onReceiveUpdates: () => onReceiveUpdates.publish(),
  onError: (error, action) => onError.publish(error, action)
})

export function setAPIAccessToken(key, secret) {
  console.info("Setting likedb API access token")
  sync.servers.apiKey = key
  sync.servers.apiSecret = secret
}
