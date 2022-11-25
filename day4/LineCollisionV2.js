"use strict";

/*
Ideen:
- random color funktion in Linetype referenzieren
- für gewisse Zone gewisse Farbe, damit es mehr ein Bild ergibt.
- mehr linetypes austesten
-farben verbessern
- linien reagieren aufeinander`?

*/

const DIRECTIONS = {
    NORTH: "north",
    SOUTH: "south",
    EAST: "east",
    WEST: "west",
};

const OwnLine = {
    pointA: {
        x: -1,
        y: -1,
    },
    pointB: {
        x: -1,
        y: -1,
    },
};

const Position = {
    x: 0,
    y: 0,
    angle: 0,
    direction: DIRECTIONS.SOUTH,
    lineType: null,
};

const SHAPES = {
    LINE_ROUND: "line_round",
    LINE_STRAIGHT: "line_straight",
    CIRCLE: "circle",
};

const LineType = {
    width: 0,
    gap: 0,
    length: 0,
    shape: SHAPES.LINE_ROUND,
    lineColor: null,
};
// removed LineTypes
/* {
        width: 30,
        gap: 80,
        length: 30,
        shape: SHAPES.CIRCLE,
        lineColor: "#943619",
    },    {
        width: 80,
        gap: 100,
        length: 80,
        shape: SHAPES.CIRCLE,
        lineColor: "#A81313",
    },
*/
/* collection of different Lines 1, with red variations and blue acccents */
const linetypes = [
    {
        width: 20,
        gap: 0,
        length: 20,
        shape: SHAPES.LINE_ROUND,
        lineColor: "#173F8F",
    },
    {
        width: 20,
        gap: 40,
        length: 40,
        shape: SHAPES.LINE_ROUND,
        lineColor: "#DB7048",
    },
    {
        width: 20,
        gap: 40,
        length: 40,
        shape: SHAPES.LINE_ROUND,
        lineColor: "#D14E30",
    },
    {
        width: 12,
        gap: 0,
        length: 10,
        shape: SHAPES.LINE_STRAIGHT,
        lineColor: "#4DE37F",
    },
    {
        width: 5,
        gap: 0,
        length: 15,
        shape: SHAPES.LINE_ROUND,
        lineColor: "#6B2D2D",
    },
    {
        width: 20,
        gap: 5,
        length: 20,
        shape: SHAPES.CIRCLE,
        lineColor: "#A81313",
    },
    {
        width: 15,
        gap: 3,
        length: 30,
        shape: SHAPES.CIRCLE,
        lineColor: "#A81313",
    },
];

/* single thin blue line
const linetypes = [
    {
        width: 1,
        gap: 0,
        length: 20,
        shape: SHAPES.LINE_ROUND,
        lineColor: "#173F8F",
    },
];
*/

const angleCount = 2;
const checkForCollision = true;
const minimalDistance = 100;

let currentPos;
let ballRolling = false;
let begunLine;
let lines = [];

function setup() {
    frameRate(30);
    angleMode(DEGREES);
    createCanvas(windowWidth, windowHeight);
    background(color("#F2C76F"));

    window.onclick = () => {
        if (currentPos === undefined) {
            initStartPosition();
        }

        ballRolling = !ballRolling;
    };
}

function draw() {
    if (!ballRolling) {
        return;
    }
    let newPos = Object.create(Position);

    if (needsDirectionChange(currentPos)) {
        addPositionToLines(currentPos.x, currentPos.y);
        console.log(lines);
        newPos.direction = getNewDirection(currentPos);
        newPos.lineType = linetypes[floor(random(linetypes.length))];
        newPos.angle = getRandomAngle(newPos.direction);
    } else {
        newPos.lineType = currentPos.lineType;
        newPos.direction = currentPos.direction;
        newPos.angle = currentPos.angle;
    }

    currentPos.x += cos(newPos.angle) * newPos.lineType.gap;
    currentPos.y += sin(newPos.angle) * newPos.lineType.gap;
    newPos.x = currentPos.x + cos(newPos.angle) * (newPos.lineType.gap + newPos.lineType.length);
    newPos.y = currentPos.y + sin(newPos.angle) * (newPos.lineType.gap + newPos.lineType.length);

    drawShape(currentPos, newPos);
    currentPos = newPos;
}

function togglePlay() {
    if (ballRolling) {
        stopBall();
    } else {
        initStartPosition();
    }
}

function createPlayButton() {
    let btn = createButton("start ball");
    btn.position(0, 0);
    btn.mousePressed(initStartPosition);
}

function drawShape(currentPos, newPos) {
    if (newPos.lineType.shape === SHAPES.LINE_ROUND) {
        strokeCap(ROUND);
        strokeWeight(newPos.lineType.width);
        stroke(newPos.lineType.lineColor);
        line(currentPos.x, currentPos.y, newPos.x, newPos.y);
    } else if (newPos.lineType.shape == SHAPES.LINE_STRAIGHT) {
        strokeCap(PROJECT);
        strokeWeight(newPos.lineType.width);
        stroke(newPos.lineType.lineColor);
        line(currentPos.x, currentPos.y, newPos.x, newPos.y);
    } else if (newPos.lineType.shape == SHAPES.CIRCLE) {
        noStroke();
        fill(newPos.lineType.lineColor);
        circle(newPos.x, newPos.y, newPos.lineType.length);
    }
}

function needsDirectionChange(currentPos) {
    let collidedWithLine = false;
    if (checkForCollision) {
        collidedWithLine = checkForLineCollision(currentPos) >= 0 && travelledMinDistance(currentPos);
    }

    return currentPos.x <= 0 || currentPos.x >= width || currentPos.y <= 0 || currentPos.y >= height || collidedWithLine;
}

// if the position is outside the canvas we have to change direction.
function getNewDirection(currentPos) {
    let newDirection = currentPos.direction;

    if (currentPos.x <= 0) {
        newDirection = DIRECTIONS.EAST;
    } else if (currentPos.x >= width) {
        newDirection = DIRECTIONS.WEST;
    } else if (currentPos.y <= 0) {
        newDirection = DIRECTIONS.SOUTH;
    } else if (currentPos.y >= height) {
        newDirection = DIRECTIONS.NORTH;
    }

    return newDirection;
}

function initStartPosition() {
    currentPos = Object.create(Position);
    currentPos.x = mouseX;
    currentPos.y = mouseY;
    currentPos.direction = DIRECTIONS.SOUTH;
    currentPos.angle = getRandomAngle(currentPos.direction);
    currentPos.lineType = linetypes[0];

    addPositionToLines(currentPos.x, currentPos.y);
}

function stopBall() {
    ballRolling = false;
}

function addPositionToLines(x, y) {
    if (begunLine != undefined) {
        begunLine.pointB.x = x;
        begunLine.pointB.y = y;
        lines.push(begunLine);
    }

    begunLine = Object.create(OwnLine);
    begunLine.pointA = {};
    begunLine.pointB = {};
    begunLine.pointA.x = x;
    begunLine.pointA.y = y;
}

function completeLastLine(x, y) {
    if (lines.length <= 0) {
        console.error("cannot completeLine which does not exist!");
        return;
    }

    let oldLine = lines[lines.length - 1];
    oldLine.pointB.x = x;
    oldLine.pointB.y = y;
}

function getRandomAngle(direction) {
    let angle = (ceil(random(-angleCount, angleCount)) * 90) / angleCount;

    if (direction == DIRECTIONS.NORTH) return angle - 90;
    if (direction == DIRECTIONS.EAST) return angle;
    if (direction == DIRECTIONS.SOUTH) return angle + 90;
    if (direction == DIRECTIONS.WEST) return angle + 180;

    return 0;
}

//checks if the Ball collides with a line. if yes, returns the index of said line in the array
// with: "https://unpkg.com/p5.collide2d
function checkForLineCollision(point) {
    for (let i = 0; i < lines.length; i++) {
        let curLine = lines[i];
        if (collidePointLine(point.x, point.y, curLine.pointA.x, curLine.pointA.y, curLine.pointB.x, curLine.pointB.y)) {
            return i;
        }
    }

    return -1;
}

function travelledMinDistance(currentPos) {
    let distance = dist(currentPos.x, currentPos.y, begunLine.pointA.x, begunLine.pointA.y);
    console.log(distance);
    return distance > minimalDistance;
}
