let dots = [];
let numDots = 5000;

function setup() {
    createCanvas(innerWidth, innerHeight);
    background(15, 15, 25); // Dark background for better contrast
    
    // Calculate sphere radius based on screen size
    let radius = min(width, height) * 0.2;
    
    // Generate and store all dot positions
    for (let i = 0; i < numDots; i++) {
        // Generate random spherical coordinates
        let phi = random(0, TWO_PI);
        let theta = acos(random(-1, 1));
        
        // Convert spherical to Cartesian coordinates
        let x = radius * sin(theta) * cos(phi);
        let y = radius * sin(theta) * sin(phi);
        let z = radius * cos(theta);
        
        // Add color and size variety
        let colorVariant = random(0, 1);
        let sizeVariant = random(0.5, 1.5);
        
        dots.push({
            originalX: x,
            originalY: y,
            originalZ: z,
            currentX: x,
            currentY: y,
            currentZ: z,
            phi: phi,
            theta: theta,
            colorVariant: colorVariant,
            sizeVariant: sizeVariant,
            pulseOffset: random(0, TWO_PI) // For pulsing animation
        });
    }
}

function draw() {
    // Create a subtle gradient background
    for (let i = 0; i <= height; i++) {
        let alpha = map(i, 0, height, 0, 1);
        let r = lerp(15, 25, alpha);
        let g = lerp(15, 35, alpha);
        let b = lerp(25, 45, alpha);
        stroke(r, g, b);
        line(0, i, width, i);
    }
    
    // Move to center of canvas
    translate(width / 2, height / 2);
    
    // Calculate sphere radius based on screen size
    let radius = min(width, height) * 0.2;
    
    // Get mouse position relative to center
    let mouseXRel = mouseX - width / 2;
    let mouseYRel = mouseY - height / 2;
    
    // Check if mouse is inside the sphere (approximate 2D check)
    let mouseDistFromCenter = sqrt(mouseXRel * mouseXRel + mouseYRel * mouseYRel);
    let isMouseInSphere = mouseDistFromCenter < radius;
    
    // Update dot positions
    for (let dot of dots) {
        if (isMouseInSphere) {
            // Calculate distance from mouse to dot (2D)
            let distToMouse = sqrt((dot.currentX - mouseXRel) * (dot.currentX - mouseXRel) + 
                                 (dot.currentY - mouseYRel) * (dot.currentY - mouseYRel));
            
            let repelRadius = 100; // Slightly larger radius of influence
            
            if (distToMouse < repelRadius && distToMouse > 0) {
                // Calculate repulsion force
                let force = map(distToMouse, 0, repelRadius, 1, 0);
                force = force * force; // Quadratic falloff for smoother effect
                
                // Direction away from mouse
                let dirX = (dot.currentX - mouseXRel) / distToMouse;
                let dirY = (dot.currentY - mouseYRel) / distToMouse;
                
                // Apply repulsion with some randomness
                let repelStrength = 35 + sin(frameCount * 0.02 + dot.pulseOffset) * 5;
                dot.currentX = lerp(dot.currentX, dot.originalX + dirX * repelStrength * force, 0.12);
                dot.currentY = lerp(dot.currentY, dot.originalY + dirY * repelStrength * force, 0.12);
            } else {
                // Return to original position
                dot.currentX = lerp(dot.currentX, dot.originalX, 0.06);
                dot.currentY = lerp(dot.currentY, dot.originalY, 0.06);
            }
        } else {
            // Return to original position when mouse is outside
            dot.currentX = lerp(dot.currentX, dot.originalX, 0.06);
            dot.currentY = lerp(dot.currentY, dot.originalY, 0.06);
        }
    }
    
    // Draw all dots with enhanced aesthetics
    noStroke();
    for (let dot of dots) {
        // Use original Z for depth effects
        let baseSize = map(dot.originalZ, -radius, radius, 1, 6);
        let dotSize = baseSize * dot.sizeVariant;
        
        // Add subtle pulsing effect
        let pulse = sin(frameCount * 0.03 + dot.pulseOffset) * 0.3 + 1;
        dotSize *= pulse;
        
        // Enhanced opacity based on depth
        let baseOpacity = map(dot.originalZ, -radius, radius, 30, 255);
        let opacity = baseOpacity * (0.7 + 0.3 * pulse);
        
        // Color variety based on position and variant
        let hue = map(dot.phi, 0, TWO_PI, 180, 300); // Blue to purple range
        hue += dot.colorVariant * 60; // Add some variation
        let saturation = map(dot.originalZ, -radius, radius, 40, 80);
        let brightness = map(dot.originalZ, -radius, radius, 60, 90);
        
        // Convert HSB to RGB and apply
        colorMode(HSB);
        let c = color(hue, saturation, brightness, opacity);
        colorMode(RGB);
        fill(c);
        
        // Add glow effect for dots closer to viewer
        if (dot.originalZ > radius * 0.3) {
            // Draw glow
            fill(red(c), green(c), blue(c), opacity * 0.3);
            circle(dot.currentX, dot.currentY, dotSize * 2.5);
        }
        
        // Draw main dot
        fill(c);
        circle(dot.currentX, dot.currentY, dotSize);
        
        // Add sparkle effect for some dots
        if (dot.colorVariant > 0.95 && pulse > 1.2) {
            fill(255, 255, 255, opacity * 0.8);
            circle(dot.currentX, dot.currentY, dotSize * 0.3);
        }
    }
}
