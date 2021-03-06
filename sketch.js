var socket
var current = {
  color: '#34495e',
  weight: 1
}
var pg
var weightSlider = document.getElementById('weight-slider')

weightSlider.addEventListener('change', changeWeight, false)

function changeWeight(e) {
  current.weight = e.target.value
}

function changeColor(color) {
  current.color = `#${color}`
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  pg = createGraphics(windowWidth, windowHeight)
  pg.background(255)
  
  // Start a socket connect to the server
  socket = io.connect('http://localhost:3000')
  socket.on('drawing', data => {
    console.log('Got:', `[${data.x0}, ${data.y0}] [${data.x1}, ${data.y1}`)

    pg.stroke(data.color)
    pg.strokeWeight(data.weight)
    pg.line(data.x0 * width, data.y0 * height, data.x1 * width, data.y1 * height);
  })
}

function draw() {
  image(pg, 0, 0)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  var oldPg = pg
  pg = createGraphics(windowWidth, windowHeight)
  pg.background(255)
  pg.image(oldPg, 0, 0)
}

function drawLine(x0, y0, x1, y1) {
  pg.stroke(current.color)
  pg.strokeWeight(current.weight)
  pg.line(x0, y0, x1, y1)

  console.log('sendmouse:', `[${x0}, ${y0}] [${x1}, ${y1}]`)
  socket.emit('mouse', {
    x0: x0 / width,
    y0: y0 / height,
    x1: x1 / width,
    y1: y1 / height,
    color: current.color,
    weight: current.weight
  })
}

function mousePressed() {
  if (mouseButton === LEFT) {
    current.x = mouseX
    current.y = mouseY
  }
}

function mouseDragged(e) {
  if (mouseButton === LEFT) {
    if (e.target.tagName === 'CANVAS') {
      drawLine(current.x, current.y, mouseX, mouseY)
      current.x = mouseX
      current.y = mouseY
    }
  }
}
