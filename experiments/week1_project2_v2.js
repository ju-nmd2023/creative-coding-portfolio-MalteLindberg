let tileSize;
let tilesX, tilesY;
let tiles = [];
let currentX = 0;
let currentY = 0;
let yOffset = 0;

function setup() {
    createCanvas(innerWidth, innerHeight);    
    tileSize = width / 40;
    tilesX = Math.ceil(width / tileSize);
    tilesY = Math.ceil(height / tileSize);
    tiles = [];
}

function draw() {
    background(255, 255, 255);
    addNewTile();
    drawTiledLines();
}

function addNewTile() {
    // Initialize row if it doesn't exist
    if (!tiles[currentY]) {
        tiles[currentY] = [];
    }
    
    // Add a single tile at current position
    tiles[currentY][currentX] = random([true, false]);
    
    // Move to next position (left to right, top to bottom)
    currentX++;
    if (currentX >= tilesX) {
        currentX = 0;
        currentY++;
        
        // Check if screen is filled and need to scroll up
        if (currentY * tileSize >= height) {
            shiftTilesUp();
            currentY--; // Stay on the same visual row since we shifted up
        }
    }
}

function shiftTilesUp() {
    // Smoothly move all tiles up by one row
    yOffset -= tileSize;
    
    // Remove the top row after animation completes
    if (tiles.length > 0) {
        tiles.shift();
        // Shift yOffset back
        yOffset += tileSize;
    }
}

function drawTiledLines() {
    strokeWeight(2);
    stroke(0);
    
    for (let y = 0; y < tiles.length; y++) {
        if (tiles[y]) { // Check if row exists
            for (let x = 0; x < tilesX; x++) {
                if (tiles[y][x] !== undefined) { // Check if tile exists
                    let posX = x * tileSize;
                    let posY = y * tileSize + yOffset;
                    
                    // Only draw tiles that are visible on screen
                    if (posY > -tileSize && posY < height + tileSize) {
                        push();
                        translate(posX, posY);
                        
                        if (tiles[y][x]) {
                            // Draw line from top-left to bottom-right
                            line(0, 0, tileSize, tileSize);
                        } else {
                            // Draw line from top-right to bottom-left
                            line(tileSize, 0, 0, tileSize);
                        }
                        pop();
                    }
                }
            }
        }
    }
}

