// HTTP

const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')

const port = 3000
const typeExt = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css'
}

const server = http.createServer(handleRequest)
server.listen(port)

console.log(`server is start on port ${port} ...`)

function handleRequest(req, res) {
  let pathname = req.url
  
  if (pathname == '/') {
    pathname = '/index.html'
  }
  
  let ext = path.extname(pathname)

  const contentType = typeExt[ext] || 'text/plain'

  fs.readFile(`${__dirname}/${pathname}`, (err, data) => {
    if (err) {
      res.writeHead(500)
      return res.end(`Error loading ${pathname}`)
    }

    res.writeHead(200, { 'Content-Type': contentType })
    res.end(data)
  })
}

// WebSocket
const io = require('socket.io').listen(server)

io.sockets.on('connection', socket => {
  console.log(`We have a new client: ${socket.id}`)

  socket.on('mouse', data => {
    console.log(` Received: mouse: [${data.x0}, ${data.y0}], [${data.x1}, ${data.y1}] `)
    socket.broadcast.emit('drawing', data)
  })

  socket.on('disconnect', () => {
    console.log('Client has disconnected')
  })
})