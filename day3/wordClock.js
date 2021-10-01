let HOUR = 'STUNDE';
let MINUTE = 'MINUTE';
let SECOND = 'SECOND';

let HOUR_COLOR;
let MINUTE_COLOR;
let SECOND_COLOR;

let HOUR_SIZE;
let MINUTE_SIZE;
let SECOND_SIZE;

let hourWords = [];
let minuteWords = [];
let secondWords = [];

let secondTimestamp;

function setup(){
    HOUR = 'STUNDE';
    MINUTE = 'MINUTE';
    SECOND = 'SECOND';

    HOUR_COLOR = color('black');
    MINUTE_COLOR = color('darkgrey');
    SECOND_COLOR = color('lightgrey');

    HOUR_SIZE = 80;
    MINUTE_SIZE = 50;
    SECOND_SIZE = 25;

    hourWords = [];
    minuteWords = [];
     secondWords = [];
    createCanvas(windowWidth, windowHeight);
    initCurrentTime();
    secondTimestamp = millis();
}


function draw(){
    background(255);
    redrawOldWords();
    let m = millis();

    if (m - secondTimestamp > 1000){
        drawSecond();
        secondTimestamp = m;
    }

    if (secondWords.length >= 60){
        secondWords.length = 0;
        drawMinute();
    }

    if (minuteWords.length >= 60){
        minuteWords.length = 0;
        drawHour();
    }
}

function redrawOldWords(){
    minuteWords.forEach(coords => {
        drawWord(MINUTE, MINUTE_SIZE, MINUTE_COLOR, coords);
    });

    secondWords.forEach(coords => {
        drawWord(SECOND, SECOND_SIZE, SECOND_COLOR, coords);
    });

    hourWords.forEach(coords => {
        drawWord(HOUR, HOUR_SIZE, HOUR_COLOR, coords);
    });
}

function initCurrentTime(){
    let curHours = hour();
    let curMinute = minute();
    let curSecond = second();

    for(let i = 0; i < curHours; i++){
        drawHour();
    }

    for(let i = 0; i < curMinute; i++){
        drawMinute();
    }

    for(let i = 0; i< curSecond; i++){
        drawSecond();
    }
}

function drawMinute(){
    let coordinates = [random(0, windowWidth), random(0,windowHeight)];
    drawWord(MINUTE, MINUTE_SIZE, MINUTE_COLOR, coordinates);
    minuteWords.push(coordinates);
}

function drawHour(){
    let coordinates = [random(0, windowWidth), random(0,windowHeight)];
    drawWord(HOUR, HOUR_SIZE, HOUR_COLOR, coordinates);
    hourWords.push(coordinates);    
}

function drawSecond(){
    let coordinates = [random(0, windowWidth), random(0,windowHeight)];
    drawWord(SECOND, SECOND_SIZE, SECOND_COLOR, coordinates);
    secondWords.push(coordinates);
}


// effectively draw the word on the screen
function drawWord(word, size, color, coordinates){
    push();
    textSize(size);
    fill(color);
    text(word, coordinates[0], coordinates[1]);
    pop();

    return coordinates;
}