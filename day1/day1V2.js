let CANVASSIDE = 800;
let GRID_DIVIDER = 30;
let GRID_STEP = CANVASSIDE / GRID_DIVIDER;

// this will be incremented with each new frame to create a rolling effect
let shapeangle = 0;
let polygons = [];

function setup() {
    createCanvas(CANVASSIDE, CANVASSIDE, SVG);
    background(255);
    noFill();
    frameRate(4);

    createGridOfPolygons();
    noLoop();
}

// create Array of Polygon Objects wich will be drawn later. So you can save the state over
// multiple Frames
function createGridOfPolygons() {
    for (let line = 0; line <= GRID_DIVIDER; line++) {
        for (let col = 0; col <= GRID_DIVIDER; col++) {
            let polygon = {
                sides: random(3, 6),
                radius: GRID_STEP / 2,
                middleX: GRID_STEP * col,
                middleY: GRID_STEP * line,
            };

            polygons.push(polygon);
        }
    }
}

function draw() {
    background(255);
    for (let i = 0; i < polygons.length; i++) {
        ownPolygon(polygons[i].sides + random(-1, 1), polygons[i].radius, polygons[i].middleX, polygons[i].middleY, shapeangle);
    }
    shapeangle++;
}

function ownPolygon(sides, radius, middleX, middleY, startangle) {
    let hasPrevious = false;
    let previousX = -1;
    let previousY = -1;
    let firstX = -1;
    let firstY = -1;

    for (let i = 0; i < sides; i++) {
        // the angle has to be converted from degrees to radians for the Math.sin and Math.cos
        let angle = i * (((360 / sides) * Math.PI) / 180) + startangle;

        let distanceY = radius * Math.sin(angle);
        let distanceX = radius * Math.cos(angle);

        if (hasPrevious) {
            line(middleX + distanceX, middleY + distanceY, previousX, previousY);
        } else {
            firstX = middleX + distanceX;
            firstY = middleY + distanceY;
        }

        hasPrevious = true;
        previousX = middleX + distanceX;
        previousY = middleY + distanceY;
    }

    line(previousX, previousY, firstX, firstY);
}

//for Exercise 3, all basic shapes inherently possible with p5
function drawAllShapes() {
    line(70, 400, 120, 300);
    triangle(100, 400, 150, 300, 200, 400);
    rect(420, 300, 80, 100);
    square(520, 300, 100);
    quad(640, 350, 680, 400, 720, 350, 680, 300);
    ellipse(250, 350, 80, 100);
    circle(350, 350, 100);
    arc(350, 350, 780, 780, radians(350), radians(10));
}
