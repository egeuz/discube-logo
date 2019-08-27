
//Initialize
let hexagon;
let line1;
let line2;
let line3;


function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas');
  hexagon = new Polygon(windowWidth/2, windowHeight/2, 200, 6);

  line1 = new ElasticLine(
    hexagon.anchor1,
    {x: mouseX, y: mouseY },
    Math.floor(hexagon.radius / 3),
    5
  );

  line2 = new ElasticLine(
    hexagon.anchor2,
    {x: mouseX, y: mouseY },
    Math.floor(hexagon.radius / 3),
    5
  );

  line3 = new ElasticLine(
    hexagon.anchor3,
    {x: mouseX, y: mouseY },
    Math.floor(hexagon.radius / 3),
    5
  );
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  hexagon = new Polygon(windowWidth/2, windowHeight/2, 200, 6);

  line1 = new ElasticLine(
    hexagon.anchor1,
    {x: mouseX, y: mouseY },
    Math.floor(hexagon.radius / 3),
    5
  );

  line2 = new ElasticLine(
    hexagon.anchor2,
    {x: mouseX, y: mouseY },
    Math.floor(hexagon.radius / 3),
    5
  );

  line3 = new ElasticLine(
    hexagon.anchor3,
    {x: mouseX, y: mouseY },
    Math.floor(hexagon.radius / 3),
    5
  );
}

function draw() {
  background(0);
  noFill();
  stroke(255);
  strokeWeight(4);
  hexagon.display();
  line1.display();
  line2.display();
  line3.display();
}

class ElasticLine {
  constructor(anchorPoint, movingPoint, segmentAmount, segmentLength) {
    this.anchorPoint = anchorPoint;
    this.movingPoint = movingPoint;
    this.segmentAmount = segmentAmount;
    this.segmentLength = segmentLength;

    //Computed variables
    this.x = new Array(this.segmentAmount).fill(0);
    this.y = new Array(this.segmentAmount).fill(0);
    this.angle = new Array(this.segmentAmount).fill(0);
    this.targetX;
    this.targetY;
  }

  stretch() {
    let dx = (this.anchorPoint.x >= this.movingPoint.x) ? this.anchorPoint.x - this.movingPoint.x : this.movingPoint.x - this.anchorPoint.x;
    let dy = (this.anchorPoint.y >= this.movingPoint.y) ? this.anchorPoint.y - this.movingPoint.y : this.movingPoint.y - this.anchorPoint.y;
    let hypotenuse = Math.sqrt((dx * dx) + (dy * dy));

    this.segmentLength = hypotenuse / this.segmentAmount;
  }

  setAnchorPoints() {
    this.x[this.x.length - 1] = this.anchorPoint.x;
    this.y[this.y.length - 1] = this.anchorPoint.y;
  }

  setMovingPoints(x, y) {
    this.movingPoint = {x: x, y: y};
  }

  positionSegment(a, b) {
    this.x[b] = this.x[a] + cos(this.angle[a]) * this.segmentLength;
    this.y[b] = this.y[a] + sin(this.angle[a]) * this.segmentLength;
  }

  reachSegment(i, xin, yin) {
    const dx = xin - this.x[i];
    const dy = yin - this.y[i];
    this.angle[i] = atan2(dy, dx);
    this.targetX = xin - cos(this.angle[i]) * this.segmentLength;
    this.targetY = yin - sin(this.angle[i]) * this.segmentLength;
  }

  createSegment(x, y, angle) {
    push();
    translate(x, y);
    rotate(angle);
    line(0, 0, this.segmentLength, 0);
    pop();
  }

  display() {
    this.setAnchorPoints();
    this.setMovingPoints(mouseX, mouseY);
    this.stretch();
    this.reachSegment(0, this.movingPoint.x, this.movingPoint.y);
    for(let i = 1; i < this.segmentAmount; i++) {
      this.reachSegment(i, this.targetX, this.targetY);
    }
    for(let i = this.x.length - 1; i >= 1; i--) {
      this.positionSegment(i, i-1);
    }
    for(let i = 0; i < this.x.length; i++) {
      this.createSegment(this.x[i], this.y[i], this.angle[i]);
    }
  }
}

class Polygon {
  constructor(x, y, radius, edges) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.edges = edges;
    
    this.angle = TWO_PI / this.edges;
    this.midpoint = new Point(this.radius * 2, this.radius * 2 * 0.87);
    this.anchor1 = new Point(
      (windowWidth - this.midpoint.x) / 2, 
      windowHeight / 2
    );
    this.anchor2 = new Point(
      ((windowWidth - this.midpoint.x) / 2) + (this.midpoint.x * 0.75),
      (windowHeight - this.midpoint.y) / 2 + 1
    );
    this.anchor3 = new Point(
      ((windowWidth - this.midpoint.x) / 2) + (this.midpoint.x * 0.75),
      (windowHeight + this.midpoint.y) / 2 - 1
    );
  }

  display() {
    beginShape();
    for (let i = 0; i < TWO_PI; i += this.angle) {
      let sx = this.x + cos(i) * this.radius;
      let sy = this.y + sin(i) * this.radius;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}