const http = require("http")
const wallpapers = require("./newtab/wallpapers.json")

const server = http.createServer((req, res) => {
  res.writeHeader(200, { "Content-Type": "text/html" })
  res.end(
    wallpapers
      .map(w => `<h3>${w.url}</h3><img width="100%" src="${w.url}" />`)
      .join("\n")
  )
})

server.on("clientError", (err, socket) => {
  socket.end("HTTP/1.1 400 Bad Request\r\n\r\n")
})

server.listen(8000)
