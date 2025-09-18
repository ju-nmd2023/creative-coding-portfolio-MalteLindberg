let scale = 50;
let resolution = 0.003;
let numberOfPoints = 1000;
let radius = 300;
let numberOfRings = 30;
function setup() {
    createCanvas(innerWidth, innerHeight);
    background(245, 240, 200); // Warm cream background
    stroke(101, 67, 23); // Rich brown for tree rings
    strokeWeight(2);
    noFill();
}

function draw() {
    treeRings();
    noLoop();
}

function treeRings(){
    for(let r = 0; r < radius; r += radius/numberOfRings){
        if(random() > 1 - 0.1*sin(r)){
            r += radius/numberOfRings;
        }

        let brownVariation = map(r, 0, radius, 80, 40); // random color calculation written with the help of Github Copilot
        stroke(brownVariation + random(-15, 15), brownVariation * 0.7 + random(-5, 5), brownVariation * 0.4 + random(-5, 5)); // random color calculation written with the help of Github Copilot
        
        if(r === radius || r > radius - radius/numberOfRings*1.1) strokeWeight(15);
        else strokeWeight(2);
        beginShape();
        if(r > radius - radius/numberOfRings*2.1 && r < radius - radius/numberOfRings*1.1);
        else{
            for(let i = 0; i < TAU; i += TAU/numberOfPoints){
                let x = width/2 + r * cos(i);
                let y = height/2 + r * sin(i);
                var n = map(noise(x * resolution, y * resolution), 0, 1, -scale, scale);
                curveVertex(x+n, y+n);
                if(random()>0.95 - 0.25*sin(r)){
                    if(r === radius || r > radius - radius/numberOfRings*1.1){

                    }
                    else{
                        endShape();
                        beginShape();
                    }
                }
            }
            endShape();
        }
        
    }
}
