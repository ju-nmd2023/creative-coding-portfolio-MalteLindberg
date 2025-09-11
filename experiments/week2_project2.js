let angleFactor, resolution, speed;
function setup() {
    createCanvas(innerWidth, innerHeight);
    colorMode(HSB, 360, 120, 100, 255);
    angleSlider = createSlider(1, 5, 1, 0.03);
    angleSlider.position(10, 200);
    angleSlider.style('width', '200px');
    angleFactor = 1;
    angleSlider.input(() => {
        angleFactor = angleSlider.value();
    });
    resolutionSlider = createSlider(0.001, 0.025, 0.004, 0.001);
    resolutionSlider.position(10, 230);
    resolutionSlider.style('width', '200px');
    resolution = 0.004;
    resolutionSlider.input(() => {
        resolution = resolutionSlider.value();
    });
    speedSlider = createSlider(0.001, 0.2, 0.01, 0.001);
    speedSlider.position(10, 260);
    speedSlider.style('width', '200px');
    speed = 0.01;
    speedSlider.input(() => {
        speed = speedSlider.value();
    });
    randomCheckBox = createCheckbox('Random Angle', false);
    randomCheckBox.position(10, 290);
    randomCheckBox.style('color', 'white');
}

function draw() {
    background(0);
    fill(255);
    noStroke();
    text('Angle Factor: ' + angleFactor.toFixed(2), angleSlider.x * 2 + angleSlider.width, 215);
    text('Resolution: ' + resolution.toFixed(3), resolutionSlider.x * 2 + resolutionSlider.width, 245);
    text('Speed: ' + speed.toFixed(3), speedSlider.x * 2 + speedSlider.width, 275);
    createFlowField();
}

function createFlowField() {
    let gap = 10;
    let length = 10;
    let centerX = width / 2;
    let centerY = height / 2;
    let circleRadius = height / 4;
    let time = frameCount * speed; // Animation speed control
    for (let i = 0; i < width; i += gap) {
        for (let j = 0; j < height; j += gap) {
            let x = i;
            let y = j;

            let distFromCenter = dist(x, y, centerX, centerY);
            if (distFromCenter > circleRadius) continue;
            for (let k = 0; k < 10; k++) {
                if (randomCheckBox.checked()) {
                    angleFactor = random(1, angleSlider.value());
                }
                let angle = noise(x * resolution, y * resolution, time) * TWO_PI * angleFactor;
                newX = x + cos(angle) * length;
                newY = y + sin(angle) * length;
                
                hue = map(angle, 0, TWO_PI, 0, 360); //creates a random hue based on the angle from 150 to 360
                stroke(hue, 120, 100, 50);
                strokeWeight(1);
                line(x, y, newX, newY);
                x = newX;
                y = newY;
            }
        }
    }
}