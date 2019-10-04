import * as api from "./api"
import { setAPIAccessToken } from "./db"

export function requiresAuth(fn) {
  return function(msg) {
    if (!isLoggedIn()) {
      return this.reply(msg, {
        error: new Error("Auth error (401)")
      })
    }

    fn.call(this, msg)
  }
}

export function isLoggedIn() {
  return !!read() || !!getDeprecatedToken()
}

export function hasPaymentMethod() {
  const user = read()
  return user && user.has_payment_method
}

export function read() {
  const raw = localStorage["user"]
  if (!raw) {
    return null
  }

  let parsed

  try {
    parsed = JSON.parse(raw)
  } catch (err) {
    console.error("Bad user object, resetting")
    reset()
    return null
  }

  if (!parsed.access_token) {
    console.error("Bad user object, resetting")
    reset()
    return null
  }

  return parsed
}

export function save(user) {
  localStorage["user"] = user
}

export function reset() {
  if (localStorage.removeItem) {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("name")
  }
}

export function getUsername() {
  const user = read()
  let name

  if (!user) {
    name = localStorage["name"]
  } else {
    name = user.name
  }

  return name ? name[0].toUpperCase() + name.slice(1) : ""
}

export function getDeprecatedToken() {
  const saved = read()
  if (saved) return saved.deprecated_token
  return localStorage["token"]
}

export function refresh(callback) {
  api.get("/api/user", (error, resp) => {
    if (error) return callback(error)
    setAPIAccessToken(resp.access_token.key, resp.access_token.secret)
    save(JSON.stringify(resp))
  })
}
