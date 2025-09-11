let angleFactor;
function setup() {
    createCanvas(innerWidth, innerHeight);
    colorMode(HSB, 360, 120, 100, 255);
    background(0);
}

function draw() {
    background(0);
    createFlowField();
}

function createFlowField() {
    let resolution = 0.004;
    let gap = 10;
    let length = 10;
    let centerX = width / 2;
    let centerY = height / 2;
    let circleRadius = height / 4;
    for (let i = 0; i < width; i += gap) {
        for (let j = 0; j < height; j += gap) {
            let x = i;
            let y = j;

            let distFromCenter = dist(x, y, centerX, centerY);
            if (distFromCenter > circleRadius) continue;
            for (let k = 0; k < 10; k++) {
                let angle = noise(x * resolution, y * resolution) * TWO_PI;
                newX = x + cos(angle) * length;
                newY = y + sin(angle) * length;
                
                hue = map(angle, 0, TWO_PI, 150, 360); //creates a random hue based on the angle from 150 to 360
                stroke(hue, 120, 100, 50);
                strokeWeight(1);
                line(x, y, newX, newY);
                x = newX;
                y = newY;
            }
        }
    }
}