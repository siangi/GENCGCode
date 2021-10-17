let BACK_COLOR;
// different color for the face Shape and the face itself
// so you can see them better when they overlap
let STROKE_COLOR;
let FACE_STROKE_COLOR;
const BASE_STROKE_WEIGHT = 10;

let points = [];

let canvas;

let drawFunc;
let clickFunc;

function setup(){
    frameRate(50);
    drawFunc = quickDraw;
    clickFunc = setPolyPoint;
    // BACK_COLOR = color('#DEC891');
    BACK_COLOR = color(255);
    STROKE_COLOR = color(80);
    FACE_STROKE_COLOR = color(0);

    canvas = createCanvas(windowWidth, windowHeight);
    canvas.mouseClicked(clickFunc);
}

function draw(){
    drawFunc();
}

function quickDraw(){
    background(BACK_COLOR);
    strokeWeight(BASE_STROKE_WEIGHT*2)
    drawInstructions();
    setPolyPoint();
    redrawPoints(points);
}

// draw function while the user is drawing a Polygon
// draws the lines from before, and to the mousePoint
// needs to do this every frame, so we don't have 1000 lines to where the mouse
// was before.
function polygonDraw(){
    background(BACK_COLOR);

    drawInstructions();

    stroke(STROKE_COLOR);
    strokeWeight(20);
    redrawPoints(points);
    
    if (points.length >= 1){
        line(points[points.length - 1][0], points[points.length - 1][1], mouseX, mouseY);
    }
}

function drawInstructions(){
    push();
    fill(0);
    noStroke();
    text("move mouse to start drawing a shape, enter to generate faces inside, backspace to start anew", 20, 20);
    pop();
    noFill();
}

//draws a polygon with the toDraw as cornerCoords. xDistance and yDistance are for drawing inside a grid
function redrawPoints(toDraw, xDistance = 0, yDistance = 0){
    let pointBefore;

    toDraw.forEach(point => {
        if (pointBefore == null){
            pointBefore = point;
            return;
        }

        line(pointBefore[0] + xDistance, pointBefore[1] + yDistance, point[0] + xDistance, point[1] + yDistance);

        pointBefore = point;
    });
}

function setPolyPoint(){
    if(mouseX != 0 || mouseY != 0){
        points.push([mouseX, mouseY]);
    }
}

function generateFaceGrid(){
    TILE_FACTOR = 5;
    tileWidth = windowWidth/TILE_FACTOR;
    tileHeight = windowHeight/TILE_FACTOR;
    scaledWeight = BASE_STROKE_WEIGHT/TILE_FACTOR;

    if (points.length <= 2){
        console.error("not enough points in the polygon to create a face!");
        return;
    }

    scaledPoints = [];
    points.forEach(point =>{
        scaledPoints.push([scaleDown(windowWidth, tileWidth, point[0]), scaleDown(windowHeight, tileHeight, point[1])]);
    });

    let left = findLeft(scaledPoints);
    let right = findRight(scaledPoints);
    let bottom = findBottom(scaledPoints);
    let top = findTop(scaledPoints);

    // find the reference points for the face features.
    let horizontalCenter = left + (right-left)/2;
    let topThird = top + (bottom-top)/3;
    let lowerThird = top + (bottom-top)*2/3;
    let quarterRight = left + (right-left)*3/4;
    let qaurterLeft = left + (right-left)/4

    for(let row = 0; row < TILE_FACTOR; row++){
        for(let col = 0; col < TILE_FACTOR; col++){
            newTopLeftX = tileWidth*col;
            newTopLeftY = tileHeight*row;
            let boundaries = {
                minX: newTopLeftX,
                minY: newTopLeftY,
                maxX: tileWidth*(col+1),
                maxY: tileHeight*(row+1)
            }

            push();
            stroke(STROKE_COLOR);
            strokeWeight(scaledWeight*2);
            redrawPoints(scaledPoints, newTopLeftX, newTopLeftY);

            stroke(FACE_STROKE_COLOR);
            strokeWeight(scaledWeight);

            eyes(qaurterLeft + newTopLeftX, quarterRight + newTopLeftX, topThird + newTopLeftY, bottom-top, boundaries);
            nose(horizontalCenter + newTopLeftX, topThird + newTopLeftY, lowerThird + newTopLeftY, left-right);
            mouth(horizontalCenter + newTopLeftX, lowerThird + newTopLeftY, right-left, bottom-top, boundaries);
            pop();
        }   
    }
}

function scaleDown(oldMax, newMax, value){
    return (value/oldMax)*newMax;
}



// draw the eyes and eybrows. boundaries are for the curve() function so the eybrows dont go too crazy
function eyes(xLeft, xRight, y, faceHeight, boundaries){
    let leftRadius = random(faceHeight/7, faceHeight/2)/2
    let rightRadius = randomGaussian(leftRadius, leftRadius/2);
    
    // eyeball
    push();
    fill(BACK_COLOR);
    circle(xLeft, y, leftRadius);
    circle(xRight, y, rightRadius);
    pop();

    // iris
    push();
    noStroke();
    fill(0);
    circle(xLeft, y, randomGaussian(leftRadius/4, leftRadius/7));
    circle(xRight, y, randomGaussian(rightRadius/4, rightRadius/7));
    pop(); 

    // eyebrows, random curves with only the section above the lines visible
    curve(random(boundaries.minX, boundaries.maxX), random(boundaries.minY, boundaries.maxY),
        xLeft-leftRadius*1.2, y-leftRadius*1.2,
        xLeft+leftRadius*1.2, y-leftRadius*1.2,
        random(boundaries.minX, boundaries.maxX), random(boundaries.minY, boundaries.maxY));
    
    curve(random(boundaries.minX, boundaries.maxX), random(boundaries.minY, boundaries.maxY),
        xRight-rightRadius*1.2, y-rightRadius*1.2,
        xRight+rightRadius*1.2, y-rightRadius*1.2,
        random(boundaries.minX, boundaries.maxX), random(boundaries.minY, boundaries.maxY));
}

function nose(xCenter, topThird, bottomThird, width){
    let standardDeviation = (bottomThird - topThird)/ 4
    topY = randomGaussian(topThird, standardDeviation)
    bottomY = random(topThird, bottomThird-standardDeviation);
    line(xCenter, randomGaussian(topThird, standardDeviation), xCenter, bottomY);
    line(xCenter, bottomY, xCenter + random(width/10, width/5), randomGaussian(bottomY, standardDeviation/3));
}

function mouth(xCenter, bottomThird, width, height, boundaries){
    let sdHeight = height/100;
    let maxWidth = width/3;
    let minWidth = width/8;

    // again ranomd curve with ony a part of it visible
    curve(random(boundaries.minX, boundaries.maxX), random(boundaries.minY, boundaries.maxY),
        xCenter - random(minWidth, maxWidth), randomGaussian(bottomThird, sdHeight),
        xCenter + random(minWidth, maxWidth), randomGaussian(bottomThird, sdHeight),
        random(boundaries.minX, boundaries.maxX), random(boundaries.minY, boundaries.maxY))
}


// the draw loop function for the face painting. does not do anything, since
// the face doens't need to be redrawn every frame.
function faceDraw(){
    background(BACK_COLOR);

    generateFaceGrid();
}

function findLeft(toCheck){
    return findXPoint(toCheck, 0, 0)[0];
}

function findRight(toCheck){
    return findXPoint(toCheck, 0, windowWidth)[0];
}

function findTop(toCheck){
    return findXPoint(toCheck, 1, 0)[1];
}

function findBottom(toCheck){
    return findXPoint(toCheck, 1, windowHeight)[1];
}

// Checks all Points and finds the closest to a Side
// @param points = all Points
// @param idxInElem = index to Check in each point Element
// @param closeTo = Number to which the point should be close (i.e 0 for left, windowWidth for right)
// returns the closest Point
function findXPoint(toCheck, idxInElem, closeTo){
    let resultPoint;

    toCheck.forEach(element => {
        if (resultPoint == null){
            resultPoint = element;
        }

        if (abs(closeTo - element[idxInElem]) < abs(closeTo - resultPoint[idxInElem])){
            resultPoint = element
        }
    });

    return resultPoint;
}

// draws a face when enter is pressed
function keyPressed(){
    if (keyCode == ENTER){
        frameRate(2);
        push();        
        drawFunc = faceDraw;
        background(BACK_COLOR);
        drawInstructions();
        // redrawPoints(points)
        // generateFace();
        generateFaceGrid();
        pop();
    } else if (keyCode == BACKSPACE){
        frameRate(10);

        points = [];
        drawFunc = quickDraw;
    }
}



