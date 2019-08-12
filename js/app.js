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

  //Watch for window resizes!
  let screenIsWide = windowWidth > 800;

  //Create base hexagon
  push();
  noFill();
  let radius = (screenIsWide) ? 240 : (windowWidth * 0.3);
  polygon(windowWidth/2, windowHeight/2, radius, 6);
  pop();
  
  //dynamically define hexagon points
  // let firstLineX = windowWidth * 0.4;
  // let firstLineY = windowHeight * 0.5;

  let horizontalMidLine = radius * 2;
  let verticalMidLine = horizontalMidLine * 0.87;

  //geometry variables
  let x0 = (windowWidth - horizontalMidLine) / 2
  let x1 = ((windowWidth - horizontalMidLine) / 2) + (horizontalMidLine / 4);
  let x2 = ((windowWidth - horizontalMidLine) / 2) + (horizontalMidLine * 0.75);
  let x3 = (windowWidth + horizontalMidLine) / 2

  let y0 = (windowHeight - verticalMidLine) / 2;
  let y1 = windowHeight / 2;
  let y2 = (windowHeight + verticalMidLine) / 2;

  noFill();

  line(x0, y1, mouseX, mouseY);
  line(x1, y0, mouseX, mouseY);
  line(x2, y0, mouseX, mouseY);
  line(x3, y1, mouseX, mouseY);
  line(x1, y2, mouseX, mouseY);
  line(x2, y2, mouseX, mouseY);
  
}

//Polygon base function
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