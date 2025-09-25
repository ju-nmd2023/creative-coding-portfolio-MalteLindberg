let synth;
let filter;
let delay, reverb, crusher, tremolo, vol;
let audioStarted = false;
let angleFactor, resolution, speed, randomFactor;
let frequency, filterFreq;

function setup() {
    createCanvas(innerWidth, innerHeight);
    angleFactor = 2;
    resolution = 0.01;
    speed = 0.01;

    // Synth effects similar to ivymeadows' code at https://editor.p5js.org/ivymeadows/sketches/B1FidNdqQ
    delay = new Tone.FeedbackDelay(0.15).toDestination();
    reverb = new Tone.JCReverb(0.4).connect(delay);
    crusher = new Tone.BitCrusher(8).connect(reverb);
    tremolo = new Tone.Tremolo(6, 0.5).connect(crusher);
    filter = new Tone.Filter(800, "lowpass").connect(tremolo);
    vol = new Tone.Volume(-10).connect(filter);
    synth = new Tone.MonoSynth({
        "oscillator": {
            "type": "triangle8"
        },
        "envelope": {
            "attack": 0.02,
            "decay": 0.2,
            "sustain": 0.6,
            "release": 0.8,
        },
        "filterEnvelope": {
            "attack": 0.001,
            "decay": 0.5,
            "sustain": 0.3,
            "release": 0.8,
            "baseFrequency": 300,
            "octaves": 3
        }
    }).connect(vol);
    colorMode(HSB, 360, 100, 100, 100);
    
    // Start Tone transport
    Tone.Transport.start();
}

function draw() {
    // Dynamic background that responds to audio
    let bgHue = audioStarted ? map(mouseX, 0, width, 220, 280) : 250;
    let bgSat = audioStarted ? map(mouseY, 0, height, 20, 40) : 30;
    background(bgHue, bgSat, 8);
    
    if (audioStarted) {
        frequency = map(mouseX, 0, width, 100, 600);
        filterFreq = map(mouseY, 0, height, 2000, 200);
        
        // Update synth frequency and filter in real-time smoothly
        synth.frequency.setValueAtTime(frequency, Tone.now());
        filter.frequency.setValueAtTime(filterFreq, Tone.now());
        
        // Map frequency to effects parameters
        crusher.bits.setValueAtTime(map(filterFreq, 200, 2000, 4, 12), Tone.now());
        tremolo.frequency.setValueAtTime(map(frequency, 100, 600, 3, 12), Tone.now());

        // Map frequency to flow field variables
        angleFactor = map(frequency, 100, 600, 1, 2);
        resolution = map(frequency, 100, 600, 0.01, 0.002);
        speed = map(filterFreq, 200, 2000, 0.005, 0.02);
        if(frequency > 500) {
            randomFactor = map(frequency, 500, 600, 1, 1.2);
        } else {
            randomFactor = 1;
        }

        // Code for central pulsing circle written with the help of Github Copilot
        let pulseSize = map(frequency, 100, 600, 50, 150);
        let centerHue = map(frequency, 100, 600, 280, 340);
        fill(centerHue, 80, 60, 20);
        noStroke();
        ellipse(width/2, height/2, pulseSize + sin(frameCount * 0.1) * 20);
        fill(centerHue, 90, 80, 40);
        ellipse(width/2, height/2, pulseSize * 0.7);
        
        createFlowField();
        
        // Add frequency indicator
        drawFrequencyIndicator();
    } else {
        fill(0, 0, 90);
        textAlign(CENTER, CENTER);
        textSize(32);
        text("Click anywhere to start", width/2, height/2);
        textSize(18);
        text("Move mouse to control sound & visuals", width/2, height/2 + 50);
    }
}

//Audio intializer function (mousePressed()) written with the help of Github Copilot
function mousePressed() {
    if (!audioStarted) {
        // Start audio context on first user interaction
        Tone.start().then(() => {
            audioStarted = true;
            // Start playing continuously
            synth.triggerAttack("C3");
        });
    }
}

function createFlowField() {
    let gap = map(frequency, 100, 600, 20, 12);
    
    let length = map(frequency, 100, 600, 8, 15);
    let centerX = width / 2;
    let centerY = height / 2;
    let circleRadius = map(filterFreq, 200, 2000, height/6, height/2.5);
    let time = frameCount * speed;
    
    for (let i = 0; i < width; i += gap) {
        for (let j = 0; j < height; j += gap) {
            let x = i;
            let y = j;
            let distFromCenter = dist(x, y, centerX, centerY);
            if (distFromCenter > circleRadius) continue;
            
            // Distance-based opacity and color variation
            let distanceRatio = distFromCenter / circleRadius;
            
            for (let k = 0; k < 8; k++) {
                let angle = noise(x * resolution, y * resolution, time) * TWO_PI * angleFactor;
                let newX = x + cos(angle) * length;
                let newY = y + sin(angle) * length;
                
                // Dynamic color based on position and audio
                let hue = map(frequency, 100, 600, 180, 320) + map(angle, 0, TWO_PI, -30, 30);
                let sat = map(filterFreq, 200, 2000, 60, 95);
                let opacity = 80 * map(k, 0, 7, 1, 0.3);

                stroke(hue, sat, 80, opacity);
                strokeWeight(map(frequency, 100, 600, 0.5, 2));
                line(x, y, newX, newY);
                
                x = newX;
                y = newY;
            }
        }
    }
}

function drawFrequencyIndicator() {
    // Frequency bar on left
    let freqBarHeight = map(frequency, 100, 600, 50, height - 100);
    let freqHue = map(frequency, 100, 600, 180, 300);
    
    fill(freqHue, 80, 70, 60);
    noStroke();
    rect(20, height - 50, 15, -freqBarHeight);
    
    // Filter bar on right
    let filterBarHeight = map(filterFreq, 200, 2000, 50, height - 100);
    let filterHue = map(filterFreq, 200, 2000, 300, 60);
    
    fill(filterHue, 80, 70, 60);
    rect(width - 35, height - 50, 15, -filterBarHeight);
    
    // Labels
    fill(0, 0, 90, 80);
    textAlign(LEFT);
    textSize(12);
    text("FREQ", 20, height - 20);
    textAlign(RIGHT);
    text("FILTER", width - 20, height - 20);
}