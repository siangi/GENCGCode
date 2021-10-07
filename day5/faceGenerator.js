let BACK_COLOR;

let points = [];

let canvas;

let drawFunc;
let clickFunc;

function setup(){
    drawFunc = polygonDraw;
    clickFunc = setPolyPoint;
    BACK_COLOR = color('#DEC891');
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.mouseClicked(clickFunc);
}

function setUpButton(){
    let button = createButton("generate a Face with this Polygon");
    button.position(0,0);
    button.mousePressed(generateFace);
}

function draw(){
    drawFunc();
}

function polygonDraw(){
    background(BACK_COLOR);
    strokeWeight(10);
    redrawPoints(points);
    if (points.length >= 1){
        line(points[points.length - 1][0], points[points.length - 1][1], mouseX, mouseY);
    }
}

function redrawPoints(toDraw){
    let pointBefore;

    toDraw.forEach(point => {
        if (pointBefore == null){
            pointBefore = point;
            return;
        }

        line(pointBefore[0], pointBefore[1], point[0], point[1]);

        pointBefore = point;
    });
}

function setPolyPoint(){
    console.log("setPoint");
    points.push([mouseX, mouseY]);
}

function generateFace(){
    if (points.length <= 2){
        console.error("not enough points in the polygon to create a face!");
        return;
    }  
    
    let left = findLeft(points);
    let right = findRight(points);
    let bottom = findBottom(points);
    let top = findTop(points);

    let horizontalCenter = left + (right-left)/2;
    let topThird = top + (bottom-top)/3;
    let lowerThird = top + (bottom-top)*2/3;
    let quarterRight = left + (right-left)*3/4;
    let qaurterLeft = left + (right-left)/4

    eyes(qaurterLeft, quarterRight, topThird, bottom-top);
    nose(horizontalCenter, topThird, lowerThird, left-right);
    mouth(horizontalCenter, lowerThird, right-left, bottom-top);
}

function eyes(xLeft, xRight, y, faceHeight){
    let leftRadius = random(faceHeight/7, faceHeight/2)/2
    let rightRadius = randomGaussian(leftRadius, leftRadius/2);
    
    circle(xLeft, y, leftRadius);
    circle(xRight, y, rightRadius);
    push();

    noStroke();
    fill(0);
    circle(xLeft, y, randomGaussian(leftRadius/4, leftRadius/8));
    circle(xRight, y, randomGaussian(rightRadius/4, rightRadius/8));
    pop(); 
}

function nose(xCenter, topThird, bottomThird, width){
    let sd = (bottomThird - topThird)/ 4
    topY = randomGaussian(topThird, sd)
    bottomY = random(topThird, bottomThird-sd);
    line(xCenter, randomGaussian(topThird, sd), xCenter, bottomY);
    line(xCenter, bottomY, xCenter + random(width/10, width/5), randomGaussian(bottomY, sd/3));
}

function mouth(xCenter, bottomThird, width, height){
    let sdHeight = height/10;
    let maxWidth = width/3;
    let minWidth = width/8;

    line(xCenter - random(minWidth, maxWidth), 
        randomGaussian(bottomThird, sdHeight), 
        xCenter + random(minWidth, maxWidth),
        randomGaussian(bottomThird, sdHeight));
}


// the draw loop function for the face painting. not used yet, maybe later
function faceDraw(){
    
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

function keyPressed(){
    drawFunc = faceDraw;
    background(BACK_COLOR);
    redrawPoints(points);
    generateFace();
}



