let scale = 40;
let resolution = 0.005;
let numberOfPoints = 1500;
let radius;
let numberOfRings = 80;
let ringData = []; // Store pre-calculated ring data

function setup() {
  createCanvas(innerWidth, innerHeight);
  background(245, 240, 200);
  stroke(101, 67, 23);
  strokeWeight(2);
  noFill();
  radius = 300;

  preCalculateRings();
}

function draw() {
  background(245, 240, 200);
  treeRings();
}

// random ring data from version 1 converted into pre-calculated data withe the help of Github Copilot
function preCalculateRings() {
  for (let r = 0; r < radius; r += radius / numberOfRings) {
    let ringInfo = {
      radius: r,
      skip: random() > 1 - 0.1 * sin(r),
      brownVariation: map(r, 0, radius, 80, 40),
      colorR: random(-15, 15),
      colorG: random(-5, 5),
      colorB: random(-5, 5),
      breakPoints: [],
    };

    // Pre-calculate break points for this ring
    for (let i = 0; i < TAU; i += TAU / numberOfPoints) {
      if (random() > 0.95 - 0.25 * sin(r)) {
        ringInfo.breakPoints.push(i);
      }
    }

    ringData.push(ringInfo);

    if (ringInfo.skip) {
      r += radius / numberOfRings;
    }
  }
}

function treeRings() {
  for (let ring of ringData) {
    let r = ring.radius;

    stroke(ring.brownVariation + ring.colorR, ring.brownVariation * 0.7 + ring.colorG, ring.brownVariation * 0.4 + ring.colorB);
    if (r === radius || r > radius - (radius / numberOfRings) * 1.1) strokeWeight(15);
    else strokeWeight(2);
    beginShape();
    if (r > radius - (radius / numberOfRings) * 2.1 && r < radius - (radius / numberOfRings) * 1.1);
    else {
      let breakIndex = 0;
      for (let i = 0; i < TAU; i += TAU / numberOfPoints) {
        let x = width / 2 + r * cos(i);
        let y = height / 2 + r * sin(i);

        // Calculate mouse influence. Mouse influence calculations written with the help of Github Copilot.
        let mouseDistance = dist(x, y, mouseX, mouseY);
        let mouseInfluence = map(mouseDistance, 0, 120, 1.5, 0);
        mouseInfluence = constrain(mouseInfluence, 0, 1.5);

        var n = map(noise(x * resolution, y * resolution), 0, 1, -scale, scale);
        n *= 1 + mouseInfluence * 0.8;

        curveVertex(x + n, y + n);

        // Check for pre-calculated break points
        if (breakIndex < ring.breakPoints.length && abs(i - ring.breakPoints[breakIndex]) < 0.01) {
          if (!(r === radius || r > radius - (radius / numberOfRings) * 1.1)) {
            endShape();
            beginShape();
          }
          breakIndex++;
        }
      }
      endShape();
    }
  }
}
