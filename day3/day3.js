function setup(){
    background(0);
}

function draw(){
    let mainCenter = [windowWidth/2, windowHeight/2];
    let hourColor = color('orange');
    let minuteColor = color('green');
    let secondColor = color('red');
    let indicatorFactor = 0.09;
    let unitFactor = 0.4;
    let weight = 5;
    let weightFactor  = 0.6;

    createCanvas(windowWidth, windowHeight);
    background(0);

    diameterHours = Math.min(windowHeight*0.5, windowWidth*0.5);

    drawCircle(mainCenter[0], mainCenter[1], diameterHours, hourColor, false, weight);
    let hourPos = calculateIndicatorPos(mainCenter[0], mainCenter[1], diameterHours/2, 12, hour());
    drawCircle(hourPos[0], hourPos[1], diameterHours*indicatorFactor, hourColor, true);
    
    let diameterMinutes = diameterHours*unitFactor;
    drawCircle(hourPos[0], hourPos[1], diameterMinutes, minuteColor, false, weight*weightFactor);
    let minutesPos = calculateIndicatorPos(hourPos[0], hourPos[1], diameterMinutes/2, 60, minute());
    drawCircle(minutesPos[0], minutesPos[1], diameterMinutes*indicatorFactor, minuteColor, true);

    let diameterSeconds = diameterMinutes*unitFactor;
    drawCircle(minutesPos[0], minutesPos[1], diameterSeconds, secondColor, false, weight*Math.pow(weightFactor, 2));
    let secondsPos = calculateIndicatorPos(minutesPos[0], minutesPos[1], diameterSeconds/2, 60, second());
    drawCircle(secondsPos[0], secondsPos[1], diameterSeconds*indicatorFactor, secondColor, true);

}

// calculates the position of a indicator on the parent circle.
// middleX, middleY = coordinates of the parent circle
// radius = radius of the parent circle
// maximum = the amount which describes a full circle (ex. 60 Minutes)
// current = the current amount (ex. 38 minutes)
// returns an array with x and y coordinate
function calculateIndicatorPos(middleX, middleY, radius, maximum, current){
    // has to be -current so it turns clockwise
    let radAngle = (2*Math.PI*-current/maximum) + Math.PI;
    
    let distanceX = radius*Math.sin(radAngle);
    let distanceY = radius*Math.cos(radAngle);

    return [middleX + distanceX, middleY + distanceY];
}

function drawCircle(middleX, middleY, diameter, color, filled, weight = 0){
    push();
    if (filled) {
        noStroke();
        fill(color);
    } else {
        noFill();
        strokeWeight(weight)
        stroke(color);
    }

    circle(middleX, middleY, diameter);
    pop();

}
