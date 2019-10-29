import sections from "./settings-sections"

class Settings {
  defaults() {
    const result = {}
    let i = sections.length
    while (i--) {
      result[sections[i].key] = sections[i].defaultValue
    }

    return result
  }

  all() {
    const result = sections.slice()
    result.forEach(row => {
      row.value = this.get(row.key)
    })
    return result
  }

  get(key) {
    const content = this.read()
    if (content.hasOwnProperty(key)) {
      return content[key]
    } else {
      let defaults = this.defaults()
      this.set(key, defaults[key])
      return defaults[key]
    }
  }

  set(key, value) {
    const content = this.read()
    content[key] = value
    return this.save(content)
  }

  read() {
    const saved = localStorage["settings"]
    if (!saved) return this.defaults()

    try {
      return JSON.parse(saved)
    } catch (err) {
      return this.defaults()
    }
  }

  save(content) {
    localStorage["settings"] = JSON.stringify(content)
  }
}

export default new Settings()
