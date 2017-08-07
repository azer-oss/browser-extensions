import likedb from "likedb"
import config from "../config"

export const db = likedb({
  host: config.host,
  token: "",
  postIntervalSecs: 1.5,
  pushIntervalSecs: 60,
  onPostUpdates: () => console.info('Kozmos just posted some updates to server'),
  onReceiveUpdates: () => console.info('Kozmos just received some updates from server')
})

export function setToken (token) {
  console.info('Setting likedb token')
  db.servers.token = token
}

export function isTokenSet () {
  return db.servers.token !== ""
}
