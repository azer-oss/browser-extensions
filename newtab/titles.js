import titleFromURL from "title-from-url"

export function isValid(title) {
  const abslen = title.replace(/[^\w]+/g, '').length
  return abslen >= 2 && !/^http\w?:\/\//.test(title)
}

export function normalize(title) {
  return title.trim().replace(/^\(\d+\)/, '')
}

export function generateFromURL(url) {
  return titleFromURL(url)
}
