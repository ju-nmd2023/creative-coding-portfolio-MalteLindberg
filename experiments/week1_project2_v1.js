function setup() {
    createCanvas(innerWidth, innerHeight);
    background(255, 255, 255);
}

function draw() {
    drawTiledLines();
    noLoop();
}

function drawTiledLines() {
    let tileSize = width / 40;
    strokeWeight(2);
    translate(width/2, height/2);
    for (let x = 0; x < width; x += tileSize) {
        for (let y = 0; y < height; y += tileSize) {
            let directionLeftToRight = random([true, false]);
            push();
            translate(x - width/2, y - height/2);
            if (directionLeftToRight) {
                line(0, 0, tileSize, tileSize);
            } else {
                line(tileSize, 0, 0, tileSize);
            }
            pop();
        }
    }
}
