const seed = Math.random();

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

  let screenIsWide = windowWidth > 800; //Watch for window resizes
  let radius = (screenIsWide) ? 240 : (windowWidth * 0.3); //Resize polygon radius based on width

  push();
  noFill();
  polygon(windowWidth/2, windowHeight/2, radius, 6);
  pop();

  //Generate lines
  generateLines(radius);
}

//Line generation function
function generateLines(radius) {

    //Geometric variables
    let horizontalMidLine = radius * 2;
    let verticalMidLine = horizontalMidLine * 0.87;

    //Coordinates
    const x0 = (windowWidth - horizontalMidLine) / 2
    const x1 = ((windowWidth - horizontalMidLine) / 2) + (horizontalMidLine / 4);
    const x2 = ((windowWidth - horizontalMidLine) / 2) + (horizontalMidLine * 0.75);
    const x3 = (windowWidth + horizontalMidLine) / 2
  
    const y0 = (windowHeight - verticalMidLine) / 2 + 1;
    const y1 = windowHeight / 2;
    const y2 = (windowHeight + verticalMidLine) / 2 - 1;


    // if(seed > 0.5) {
    //   //Distribution form 1
    //   line(x0, y1, mouseX, mouseY);
    //   line(x2, y0, mouseX, mouseY);
    //   line(x2, y2, mouseX, mouseY);
    // } else {
    //   //Distribution form 2
    //   fill(255, 255, 255, 0.5);
    //   line(x3, y1, mouseX, mouseY);
    //   line(x1, y0, mouseX, mouseY);
    //   line(x1, y2, mouseX, mouseY);
    // }
    stroke(255, 255, 255, 75);
    line(x0, y1, mouseX, mouseY);
    line(x2, y0, mouseX, mouseY);
    line(x2, y2, mouseX, mouseY);
    stroke(255);
    line(x3, y1, mouseX, mouseY);
    line(x1, y0, mouseX, mouseY);
    line(x1, y2, mouseX, mouseY);


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