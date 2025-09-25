let synth;
let filter;
let audioStarted = false;
let angleFactor, resolution, speed, randomFactor;

function setup() {
    createCanvas(innerWidth, innerHeight);
    background(53, 18, 96);
    angleFactor = 2;
    resolution = 0.01;
    speed = 0.01;

    filter = new Tone.Filter(800, "lowpass").toDestination();
    synth = new Tone.Synth().connect(filter);

    textAlign(CENTER, CENTER);
    textSize(24);
    fill(100);
    text("Click anywhere to start audio", width/2, height/2);
    colorMode(HSB, 360, 120, 100, 255);
}

function draw() {
    background(53, 18, 80);
    
    if (audioStarted) {
        // Map mouse X to frequency (200-800 Hz)
        let frequency = map(mouseX, 0, width, 200, 800);
        
        // Map mouse Y to filter frequency (200-2000 Hz)
        let filterFreq = map(mouseY, 0, height, 2000, 200);
        
        // Update synth frequency and filter in real-time smoothly
        synth.frequency.setValueAtTime(frequency, Tone.now());
        filter.frequency.setValueAtTime(filterFreq, Tone.now());

        // Map frequency to flow field variables
        angleFactor = map(frequency, 200, 800, 1, 2);
        resolution = map(frequency, 200, 800, 0.01, 0.002);
        speed = map(filterFreq, 200, 2000, 0.005, 0.02);
        if(frequency > 700) {
            randomFactor = map(frequency, 700, 800, 1, 1.2);
        } else {
            randomFactor = 1;
        }

        createFlowField();
    } else {
        // Display instructions
        textAlign(CENTER, CENTER);
        textSize(24);
        fill(20);
        text("Click anywhere to start audio", width/2, height/2);
    }
}

function mousePressed() {
    if (!audioStarted) {
        // Start audio context on first user interaction
        Tone.start().then(() => {
            audioStarted = true;
            // Start playing continuously - no more triggerAttack calls needed
            synth.triggerAttack("C4");
        });
    }
}

function mouseReleased() {
    if (audioStarted && isPlaying) {
        isPlaying = false;
        synth.triggerRelease();
    }
}

function createFlowField() {
    let frequency = map(mouseX, 0, width, 200, 800);
    let gap = map(frequency, 200, 800, 15, 10); 
    
    let length = 10;
    let centerX = width / 2;
    let centerY = height / 2;
    let circleRadius = height / 4;
    let time = frameCount * speed;
    
    for (let i = 0; i < width; i += gap) {
        for (let j = 0; j < height; j += gap) {
            let x = i;
            let y = j;
            let distFromCenter = dist(x, y, centerX, centerY);
            angleFactor = random(1, randomFactor);
            if (distFromCenter > circleRadius) continue;
            for (let k = 0; k < 10; k++) {
                let angle = noise(x * resolution, y * resolution, time) * TWO_PI * angleFactor;
                newX = x + cos(angle) * length;
                newY = y + sin(angle) * length;

                hue = map(frequency, 200, 800, 200, 360);
                stroke(hue, 120, 100, 50);
                strokeWeight(1);
                line(x, y, newX, newY);
                x = newX;
                y = newY;
            }
        }
    }
}