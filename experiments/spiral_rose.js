let translateX, translateY, ellipseSize, spiralAngle, spiralRadius, centerX, centerY, spiralSpeed, radiusGrowth, sizeDirection = 1;

function setup() {
    createCanvas(innerWidth, innerHeight);
    background('rgba(238, 226, 187, 1)');
    
    centerX = width / 2;
    centerY = height / 2;
    ellipseSize = 50;
    
    spiralAngle = 0;
    spiralRadius = 0; // Start from center
    spiralSpeed = -0.1;
    radiusGrowth = 0.5; 
    
    translateX = centerX;
    translateY = centerY;
    timer = 0;
}

function draw() {
    spiralAngle += spiralSpeed;
    spiralRadius += radiusGrowth;
    translateX = centerX + spiralRadius * cos(spiralAngle);
    translateY = centerY + spiralRadius * sin(spiralAngle);
    
    let maxRadius = height / 2;
    if (spiralRadius > maxRadius) {
        radiusGrowth *= -1;
    }
    if (spiralRadius < 0) {
        radiusGrowth *= -1;
    }
    updateSize();
    drawCircle();
}

function drawCircle(){
    noFill();
    stroke('rgba(127, 73, 141, 0.3)');
    strokeWeight(1);
    ellipse(translateX, translateY, ellipseSize, ellipseSize);
}

function updateSize(){
    let maxSize = 300;
    let minSize = 50;
    if (ellipseSize >= maxSize || ellipseSize <= minSize) {
        ellipseSize = constrain(ellipseSize, minSize, maxSize);
        sizeDirection *= -1;
    }
    ellipseSize += sizeDirection * 2;
}