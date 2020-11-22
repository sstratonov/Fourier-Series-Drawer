let time = 0;
let x = [];
let y = [];
let fourierX;
let fourierY;
let path = [];


function fourierTransform(value) {
    let X = [];
    const N = value.length
    for (let k = 0; k < N; k++) {
        let realPart = 0;
        let imaginaryPart = 0;
        for (let n = 0; n < N; n++) {
            let partAngle = (2 * Math.PI * k * n) / N
            realPart += value[n] * cos(partAngle)
            imaginaryPart -= value[n] * sin(partAngle)
        }
        realPart = realPart / N;
        imaginaryPart = imaginaryPart / N;

        let frequency = k;
        let amplitude = sqrt(realPart * realPart + imaginaryPart * imaginaryPart);
        let phase = atan2(imaginaryPart, realPart);

        X[k] = {
            realPart: realPart,
            imaginaryPart: imaginaryPart,
            frequency: frequency,
            amplitude: amplitude,
            phase: phase
        }
    }
    return X
}

function epiCycle(x, y, rotation, fourier) {
    for (let i = 0; i < fourier.length; i++) {
        let prevX = x
        let prevY = y
        let frequency = fourier[i].frequency;
        let radius = fourier[i].amplitude
        let phase = fourier[i].phase;
        x += radius * cos(frequency * time + phase + rotation);
        y += radius * sin(frequency * time + phase + rotation);

        stroke(255, 100);
        noFill()
        ellipse(prevX, prevY, radius * 2);
        fill(2, 42, 45)
        stroke(255);
        line(prevX, prevY, x, y);
    }
    return createVector(x, y)
}

function setup() {
    createCanvas(1000, 600);
    let angle = 0;
    for (let i = 0; i < 200; i++) {
        angle = map(i,0,200,0,Math.PI*2)
        x[i] = 100 * cos(angle)
        y[i] = 100 * sin(angle)
    }

    fourierX = fourierTransform(x);
    fourierY = fourierTransform(y);
}

function draw() {
    background(0);
    let vx = epiCycle(400, 50,0, fourierX)
    let vy = epiCycle(50, 200, Math.PI / 2, fourierY)
    let v = createVector(vx.x, vy.y)
    path.unshift(v)
    line(vx.x, vx.y, v.x, v.y)
    line(vy.x, vy.y, v.x, v.y)
    beginShape();
    noFill();
    for (let i = 0; i < path.length; i++) {
        vertex(path[i].x, path[i].y)
    }
    endShape();
    const dt = 2 * Math.PI / fourierX.length
    time += dt;

     if (path.length > 200){
        path.pop();
    }

}