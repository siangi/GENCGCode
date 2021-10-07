// al of this should be a state machine, I'm sorry for doing it with an enum.

let BACK_COLOR;
// pixels moved per tick
let BALL_SPEED = 10;

let lines = [];
// X, Y and the angle(radians) in which the ball is rolling
let previousBallPos = []
let ballPos = [];

let startPoint;
let canvas;

const usageModes = {
    LINE_START: "line_start",
    LINE_FINISHING: "line_finishing",
    BALL_ROLLING: "ball_rolling"
}

let usageMode = usageModes.LINE_START;

function setup(){
    BACK_COLOR = color(255);
    strokeWeight(20);
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.mouseClicked(drawPoint);
    createPlayButton();  
    defineBoundaries();
}

function createPlayButton(){
    btn = createButton("start ball");
    btn.position(0, 0);
    btn.mousePressed(startBallDraw);
}

function defineBoundaries(){
    lines.push(new Line([1, 1], [windowWidth, 1]));
    lines.push(new Line([1, 1], [1, windowHeight]));
    lines.push(new Line([windowWidth, 1], [windowWidth, windowHeight]));
    lines.push(new Line([1, windowHeight], [windowWidth, windowHeight]));
}

function draw(){
    switch (usageMode) {
        case usageModes.LINE_FINISHING:
            background(BACK_COLOR);
            line(startPoint[0], startPoint[1], mouseX, mouseY);
            lines.forEach(curLine => {
                line(curLine.pointA[0], curLine.pointA[1], curLine.pointB[0], curLine.pointB[1]);
            });             
            break;
        case usageModes.LINE_START:
            background(BACK_COLOR);
            lines.forEach(curLine => {
                line(curLine.pointA[0], curLine.pointA[1], curLine.pointB[0], curLine.pointB[1]);
            }); 
            break;
        case usageModes.BALL_ROLLING:
                ballDrawStep();
                break;
        default:
            break;
    }    
}

function drawPoint(){
    let newMode;
    switch (usageMode) {
        case usageModes.LINE_START:
            newMode = startLine();
            break;
        case usageModes.LINE_FINISHING:
            newMode = endLine();
            break;    
        case usageModes.BALL_ROLLING:
            break;    
        default:
            console.error("Illegal usageMode in drawPoint: " + usageMode);
            break;
    }

    usageMode = newMode;
}

function startLine(){
    startPoint = [mouseX, mouseY];
    return(usageModes.LINE_FINISHING);
}

function endLine(){
    if (startPoint == null){
        console.error("Trying to finish line that wasn't started");
        return;
    }
    lines.push(new Line(startPoint, [mouseX, mouseY]));
    return(usageModes.LINE_START);
}

function startBallDraw(){
    if (usageMode != usageModes.BALL_ROLLING){
        ballPos = [random(windowWidth), random(windowHeight), random(2*Math.PI)];
        usageMode = usageModes.BALL_ROLLING;
    }
}

function ballDrawStep(){
    // ballAngle = Math.atan((ballPos[1] - newY)/(ballPos[0] - newX)); 

    
    collideIdx = checkForLineCollision(ballPos);
    if (collideIdx >= 0){
    //     lineAngle = Math.atan((lines[collideIdx].pointA[1] - lines[collideIdx].pointB[1])/(lines[collideIdx].pointA[0] - lines[collideIdx].pointB[0]));
    //     angleBetween = lineAngle - ballAngle;
    //     let degsBetw = degrees(angleBetween);
    //     ballPos[2] = 2*Math.PI - angleBetween;

    //     console.log("Collision detected");
        ballPos[2] = random(2*Math.PI);
    }
    
    newX = ballPos[0] + BALL_SPEED*Math.cos(ballPos[2]);
    newY = ballPos[1] + BALL_SPEED*Math.sin(ballPos[2]);
    
    line(ballPos[0], ballPos[1], newX, newY);


    ballPos[0] = newX;
    ballPos[1] = newY;    
}

//checks if the Ball collides with a line. if yes, returns the index of said line in the array
function checkForLineCollision(point){
    for(let i = 0; i < lines.length; i++){
        curLine = lines[i];
        if (collidePointLine(point[0], point[1], curLine.pointA[0], curLine.pointA[1], curLine.pointB[0], curLine.pointB[1])){
            return i;
        }
    }

    return -1;
}

