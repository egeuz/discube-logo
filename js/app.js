function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('drawingCanvas');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  fill(255);
  stroke(255);
  strokeWeight(3);

  //Create base hexagon
  push();
  noFill();
  let radius = (windowWidth < 800) ? (windowWidth * 0.3) : 240;
  polygon(windowWidth/2, windowHeight/2, radius, 6);
  pop();

  //Create dynamic lines
  line(480, 271.5, mouseX, mouseY);
  line(836, 480, mouseX, mouseY);
  line(480, 685, mouseX, mouseY);
  
}

function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  for (let i=0; i<TWO_PI; i+= angle) {
    let sx = x + cos(i) * radius;
    let sy = y + sin(i) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}