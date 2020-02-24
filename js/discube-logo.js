var logo;
let BG_COLOR;
let STROKE;
let lineMode = "stretch";
let animationMode = "mouse";

/*************************/
/******** RUNTIME ********/
/*************************/

function setup() {
  BG_COLOR = color("#061919");
  // BG_COLOR = color('#111111');
  STROKE = color("#e6e8e6");
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas');
  logo = new Logo(createVector(width / 2, height / 2), lineMode, animationMode);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  logo = new Logo(createVector(width / 2, height / 2), lineMode, animationMode);
}

function draw() {
  background(BG_COLOR);
  stroke(STROKE);
  noFill();
  strokeWeight(4);
  logo.run();
}

/*************************/
/******** CLASSES ********/
/*************************/

class Logo {
  constructor(location, lineMode, animationMode) {
    this.location = location;
    this.lineMode = lineMode;
    this.animationMode = animationMode;
    this.hexagon = new Hexagon(location, 180);
    this.lines = [
      new Line(this.hexagon.anchor1),
      new Line(this.hexagon.anchor2),
      new Line(this.hexagon.anchor3)
    ];

    //noise mode variables
    this.offset = createVector(random(1000), random(1000));
    console.log(this.offset);
    this.range = this.hexagon.radius * 2;
    //static mode variables
    this.staticPoint = createVector(width / 2, height / 2);
    //oscillation mode variables
    this.angle = createVector();
    this.velocity = createVector(random(0.01, 0.02), random(0.01, 0.02));
  }

  run() {
    this.hexagon.display();
    this.lines.forEach(line => {
      //ANIMATION MODES
      if (this.animationMode === "mouse") line.setMovingPoint(mouseX, mouseY);
      if (this.animationMode === "noise") {
        let x = (map(noise(this.offset.x), 0, 1, this.location.x - this.range, this.location.x + this.range));
        let y = (map(noise(this.offset.y), 0, 1, this.location.y - this.range, this.location.y + this.range));
        this.offset.add(this.velocity);
        line.setMovingPoint(x, y);
      }
      if (this.animationMode === "oscillation") {
        this.angle.add(this.velocity);
        let x = this.location.x + sin(this.angle.x) * this.range;
        let y = this.location.y + sin(this.angle.y) * this.range;
        line.setMovingPoint(x, y);
      }
      if (this.animationMode === "static") line.setMovingPoint(this.staticPoint.x, this.staticPoint.y);

      //LINE MODES
      if (this.lineMode === "stretch") line.stretchLine();
      if (this.lineMode === "rigid") line.rigidLine();
      if (this.lineMode === "long") line.longLine();
    });
  }

  stretchMode() {
    this.lineMode = "stretch";
  }

  rigidMode() {
    this.lineMode = "rigid";
  }

  longMode() {
    this.lineMode = "long";
  }

  mouseMode() {
    this.animationMode = "mouse";
  }

  noiseMode(range, speed) {
    this.range = (range) ? range : this.hexagon.radius * 2;
    this.velocity = (speed) ? speed : createVector(random(0.001, 0.003), random(0.001, 0.003));
    this.animationMode = "noise";
  }

  oscillationMode(range, speed) {
    this.range = (range) ? range : this.hexagon.radius / 2;
    this.velocity = (speed) ? speed : createVector(random(0.005, 0.015), random(0.005, 0.015));
    this.animationMode = "oscillation"
  }

  staticMode(point) {
    if (point) this.staticPoint = point;
    this.animationMode = "static";
  }

  changeColor(hexCode) {
    STROKE = (hexCode) ? color(hexCode) : color("#e6e8e6");
  }
}

class Line {
  constructor(anchor) {
    this.segmentAmount = 100;
    this.segmentLength = 5;
    this.anchor = anchor;
    this.movingPoint = createVector();
    this.target = createVector();
    this.angles = new Array(this.segmentAmount).fill(0);
    this.locations = new Array(this.segmentAmount).fill(createVector(0, 0));
    this.locations[this.locations.length - 1] = this.anchor;
  }

  setMovingPoint(x, y) {
    this.movingPoint = createVector(x, y);
  }

  rigidLine() {
    line(this.anchor.x, this.anchor.y, this.movingPoint.x, this.movingPoint.y);
  }

  stretchLine() {
    this.stretch();
    this.reachSegments();
    this.positionSegments();
    this.drawSegments();
  }

  longLine(segmentLength) {
    this.segmentLength = (segmentLength) ? segmentLength : 7;
    this.reachSegments();
    this.positionSegments();
    this.drawSegments();
  }

  //HELPER METHODS
  stretch() {
    let dx = (this.anchor.x >= this.movingPoint.x) ? this.anchor.x - this.movingPoint.x : this.movingPoint.x - this.anchor.x;
    let dy = (this.anchor.y >= this.movingPoint.y) ? this.anchor.y - this.movingPoint.y : this.movingPoint.y - this.anchor.y;
    let hypotenuse = Math.sqrt((dx * dx) + (dy * dy));
    this.segmentLength = hypotenuse / this.segmentAmount;
  }

  reachSegments() {
    for (let i = 0; i < this.locations.length; i++) {
      const x = (i === 0) ? this.movingPoint.x : this.target.x;
      const y = (i === 0) ? this.movingPoint.y : this.target.y;
      const dx = x - this.locations[i].x;
      const dy = y - this.locations[i].y;
      this.angles[i] = atan2(dy, dx);
      this.target = createVector(
        x - cos(this.angles[i]) * this.segmentLength,
        y - sin(this.angles[i]) * this.segmentLength
      );
    }
  }

  positionSegments() {
    for (let i = this.locations.length - 1; i >= 1; i--) {
      this.locations[i - 1] = createVector(
        this.locations[i].x + cos(this.angles[i]) * this.segmentLength,
        this.locations[i].y + sin(this.angles[i]) * this.segmentLength
      );
    }
  }

  drawSegments() {
    for (let i = 0; i < this.locations.length; i++) {
      push();
      translate(this.locations[i].x, this.locations[i].y);
      rotate(this.angles[i]);
      line(0, 0, this.segmentLength, 0);
      pop();
    }
  }
}


class Hexagon {
  constructor(location, radius) {
    this.location = location;
    this.radius = radius;
    //computed properties
    this.edges = 6;
    this.angle = TWO_PI / 6;
    this.midpoint = createVector(this.radius * 2, this.radius * 2 * 0.87);
    //anchor points
    this.anchor1 = createVector(
      (windowWidth - this.midpoint.x) / 2,
      windowHeight / 2
    );
    this.anchor2 = createVector(
      (windowWidth - this.midpoint.x) / 2 + this.midpoint.x * 0.75,
      (windowHeight - this.midpoint.y) / 2 + 1
    );
    this.anchor3 = createVector(
      (windowWidth - this.midpoint.x) / 2 + (this.midpoint.x * 0.75),
      (windowHeight + this.midpoint.y) / 2 - 1
    );
  }

  display() {
    beginShape();
    for (let i = 0; i < TWO_PI; i += this.angle) {
      let x = this.location.x + cos(i) * this.radius;
      let y = this.location.y + sin(i) * this.radius;
      vertex(x, y);
    }
    endShape();
  }
}