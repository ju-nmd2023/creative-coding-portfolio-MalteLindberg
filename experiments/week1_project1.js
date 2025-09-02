function setup() {
    createCanvas(innerWidth, innerHeight);
    background(255, 255, 255);
}

function variation1() {
    push();
    noFill();
    stroke(0,0,0);
    strokeWeight(0.7);
    translate(width / 3, height / 2.2);
    rectMode(CENTER);
    for (let i = 0; i < 50; i++) {
        rect(0, 0, i * 8, i * 8);
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
        let size = i * 8;
        let half = size / 2;
        
        beginShape();
        noFill();
        
        // Top line (left to right)
        for (let x = -half; x <= half; x += 5) {
            let y = -half + random(-2, 2);
            vertex(x, y);
        }
        
        // Right line (top to bottom)
        for (let y = -half; y <= half; y += 5) {
            let x = half + random(-2, 2);
            vertex(x, y);
        }
        
        // Bottom line (right to left)
        for (let x = half; x >= -half; x -= 5) {
            let y = half + random(-2, 2);
            vertex(x, y);
        }
        
        // Left line (bottom to top)
        for (let y = half; y >= -half; y -= 5) {
            let x = -half + random(-2, 2);
            vertex(x, y);
        }
        
        endShape(CLOSE);
    }
    pop();
}


function draw() {
    background(255, 255, 255); // Clear the background
    variation1();
    variation2();
    
    // Check if mouse is hovering over variation2 area
    let variation2X = width / 1.5;
    let variation2Y = height / 2.2;
    let maxSize = 49 * 8;
    
    // Add instruction text under variation2
    fill(0);
    textAlign(CENTER);
    textSize(14);
    text("Click on the square to regenerate", width / 1.5, height / 2.2 + maxSize/2 + 30);
    
    noLoop();
}

function mousePressed() {
    let variation2X = width / 1.5;
    let variation2Y = height / 2.2;
    let maxSize = 49 * 8;
    
    if (mouseX > variation2X - maxSize/2 && mouseX < variation2X + maxSize/2 &&
        mouseY > variation2Y - maxSize/2 && mouseY < variation2Y + maxSize/2) {
        redraw();
    }
}