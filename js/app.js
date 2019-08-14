//Initialize Variables
let numSegments,
  x1 = [],
  x2 = [],
  x3 = [],
  y1 = [],
  y2 = [],
  y3 = [],
  angle = [],
  segLength = 5,
  targetX,
  targetY,
  screenIsWide,
  radius,
  horizontalMidline,
  verticalMidLine;


function setup() {
  //Setup canvas
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas');

  //Setup lines
  screenIsWide = windowWidth > 800; //Watch for window resizes
  radius = (screenIsWide) ? 200 : (windowWidth * 0.3); //Resize polygon radius based on width
  numSegments = (radius * 2) / 6;
  initializeArrays(numSegments);
  setupLines(radius);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  //Re-setup lines
  screenIsWide = windowWidth > 800; //Watch for window resizes
  radius = (screenIsWide) ? 200 : (windowWidth * 0.3); //Resize polygon radius based on width
  numSegments = (radius * 2) / 6;
  initializeArrays(numSegments);
  setupLines(radius);
}


//Get Drawing
function draw() {
  background(0);
  stroke(255);
  strokeWeight(3);

  //Polygon Setup
  screenIsWide = windowWidth > 800; //Watch for window resizes
  radius = (screenIsWide) ? 200 : (windowWidth * 0.3); //Resize polygon radius based on width
  push();
  noFill();
  polygon(windowWidth/2, windowHeight/2, radius, 6);
  pop();

  console.log("mouseX is " + mouseX > windowWidth / 2 - radius);
  //Generate lines [NEW]
  if (mouseX < windowWidth / 2 - radius || mouseX > windowWidth / 2 + radius || mouseY < windowHeight / 2 - radius || mouseY > windowHeight / 2 + radius) {
    generateLines(radius);
  } else {
    drawLine(x1, y1);
    drawLine(x2, y2);
    drawLine(x3, y3);
  }
}

function initializeArrays(numSegments) {
  for (let i = 0; i < numSegments; i++) {
    x1[i] = 0;
    y1[i] = 0;
    x2[i] = 0;
    y2[i] = 0;
    x3[i] = 0;
    y3[i] = 0;
    angle[i] = 0;
  }  
}

function setupLines(radius) {
  let horizontalMidLine = radius * 2;
  let verticalMidLine = horizontalMidLine * 0.87;

  //Coordinates
  const coordinateX0 = (windowWidth - horizontalMidLine) / 2
  const coordinateX1 = ((windowWidth - horizontalMidLine) / 2) + (horizontalMidLine / 4);
  const coordinateX2 = ((windowWidth - horizontalMidLine) / 2) + (horizontalMidLine * 0.75);
  const coordinateX3 = (windowWidth + horizontalMidLine) / 2

  const coordinateY0 = (windowHeight - verticalMidLine) / 2 + 1;
  const coordinateY1 = windowHeight / 2;
  const coordinateY2 = (windowHeight + verticalMidLine) / 2 - 1;

  x1[x1.length - 1] = coordinateX0; // Set base x-coordinate
  y1[y1.length - 1] = coordinateY1; // Set base y-coordinate

  x2[x2.length - 1] = coordinateX2; // Set base x-coordinate
  y2[y2.length - 1] = coordinateY0; // Set base y-coordinate

  x3[x3.length - 1] = coordinateX2; // Set base x-coordinate
  y3[y3.length - 1] = coordinateY2; // Set base y-coordinate
}

function drawLine(x, y) {
  reachSegment(0, mouseX, mouseY, x, y);

  for (let i = 1; i < numSegments; i++) {
    reachSegment(i, targetX, targetY, x, y);
  }
  for (let j = x.length - 1; j >= 1; j--) {
    positionSegment(j, j - 1, x, y);
  }
  for (let k = 0; k < x.length; k++) {
    segment(x[k], y[k], angle[k], (k + 1) * 2);
  }
}

function positionSegment(a, b, x, y) {
  x[b] = x[a] + cos(angle[a]) * segLength;
  y[b] = y[a] + sin(angle[a]) * segLength;
}

function reachSegment(i, xin, yin, x, y) {
  const dx = xin - x[i];
  const dy = yin - y[i];
  angle[i] = atan2(dy, dx);
  targetX = xin - cos(angle[i]) * segLength;
  targetY = yin - sin(angle[i]) * segLength;
}

function segment(x, y, a, sw) {
  push();
  translate(x, y);
  rotate(a);
  line(0, 0, segLength, 0);
  pop();
}

/*** OLD CODE ***/
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

    stroke(255);
    line(x0, y1, mouseX, mouseY);
    line(x2, y0, mouseX, mouseY);
    line(x2, y2, mouseX, mouseY);
    // stroke(255);
    // line(x3, y1, mouseX, mouseY);
    // line(x1, y0, mouseX, mouseY);
    // line(x1, y2, mouseX, mouseY);
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