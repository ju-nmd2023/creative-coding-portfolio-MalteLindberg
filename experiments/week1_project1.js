let maxSize, squareSize, variation2X, variation2Y;
function setup() {
    createCanvas(innerWidth, innerHeight);
    background(255, 255, 255);

    variation2X = width / 1.5;
    variation2Y = height / 2.2;
    maxSize = (height * 2) / 5;
    squareSize = maxSize / 50;

    rotationSlider = createSlider(0, TWO_PI, 0, 0.1);
    rotationSlider.position(width/2 - 100, variation2Y + maxSize/2 + 70);
    rotationSlider.style('width', '200px');
    rotationSlider.input(redraw); // Redraw code writen with the help of Github Copilot
}

function variation1() {
    push();
    noFill();
    stroke(0,0,0);
    strokeWeight(0.7);
    translate(width / 3, height / 2.2);
    rectMode(CENTER);
    
    for (let i = 0; i < 50; i++) {
        push();
        rotate(i * rotationSlider.value());
        rect(0, 0, i * squareSize, i * squareSize);
        pop();
    }
    pop();
}

function variation2() {
    push();
    noFill();
    stroke(0,0,0);
    strokeWeight(0.7);
    translate(width / 1.5, height / 2.2);
    rectMode(CENTER);
    
    for (let i = 0; i < 50; i++) {
        push();
        rotate(i * rotationSlider.value());
        let size = i * squareSize;
        let half = size / 2;
        beginShape();
        noFill();
        
        for (let x = -half; x <= half; x += 5) {
            let y = -half + random(-2, 2);
            vertex(x, y);
        }
        for (let y = -half; y <= half; y += 5) {
            let x = half + random(-2, 2);
            vertex(x, y);
        }
        for (let x = half; x >= -half; x -= 5) {
            let y = half + random(-2, 2);
            vertex(x, y);
        }
        for (let y = half; y >= -half; y -= 5) {
            let x = -half + random(-2, 2);
            vertex(x, y);
        }
        endShape(CLOSE);
        pop();
    }
    pop();
}


function draw() {
    background(255, 255, 255); // Clear the background
    variation1();
    variation2();

    fill(0);
    textAlign(CENTER);
    textSize(14);
    text("Click on the square to regenerate", variation2X, variation2Y + maxSize/2 + 40);
    
    text("Rotation", width/2, variation2Y + maxSize/2 + 60);
    noLoop();
}

function mousePressed() {
    let variation2X = width / 1.5;
    let variation2Y = height / 2.2;
    if (mouseX > variation2X - maxSize/2 && mouseX < variation2X + maxSize/2 &&
        mouseY > variation2Y - maxSize/2 && mouseY < variation2Y + maxSize/2) {
        redraw();
    } // If statement writen with the help of Github Copilot
}