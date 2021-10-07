let HOUR = 'STUNDE';
let MINUTE = 'MINUTE';
let SECOND = 'SEKUNDE';

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

let nextMinuteCoord;
let nextHourCoord;

function setup(){
    HOUR = 'STUNDE';
    MINUTE = 'MINUTE';
    SECOND = 'SECOND';

    HOUR_COLOR = color('#d62828');
    MINUTE_COLOR = color('#f77f00');
    SECOND_COLOR = color('#fcbf49');

    HOUR_SIZE = 80;
    MINUTE_SIZE = 50;
    SECOND_SIZE = 25;

    hourWords = [];
    minuteWords = [];
    secondWords = [];
    createCanvas(windowWidth, windowHeight);
    nextHourCoord = [random(0, windowWidth), random(0,windowHeight)];
    nextMinuteCoord = [random(0, windowWidth), random(0,windowHeight)];
    initCurrentTime();
    secondTimestamp = millis();
}


function draw(){
    background('#003049');
    redrawOldWords();
    let m = millis();

    if (m - secondTimestamp > 1000){
        drawSecond();
        secondTimestamp = m;
    }

    if (secondWords.length >= 59){
        secondWords = moveWordstoNextWord(nextMinuteCoord[0], nextMinuteCoord[1], 0.1, secondWords);
    }

    if (secondWords.length >= 60){
        secondWords.length = 0;
        drawMinute();
    }
    
    if (secondWords.length >= 59 && minuteWords.length >= 59){
        minuteWords = moveWordstoNextWord(nextHourCoord[0], nextHourCoord[1], 0.1, minuteWords);
    }

    if (minuteWords.length >= 60){
        minuteWords.length = 0;
        drawHour();
    }
}

// updates coordinates for each word. so they gradually move to the place of the next spawning
// higher word
function moveWordstoNextWord(goalX, goalY, t, toMove){
    let newWordCoords = [];

    toMove.forEach(oldCoords => {
        let newX = lerp(oldCoords[0], goalX, t);
        let newY = lerp(oldCoords[1], goalY, t);
        newWordCoords.push([newX, newY]);
    });

    return newWordCoords;
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
    drawWord(MINUTE, MINUTE_SIZE, MINUTE_COLOR, nextMinuteCoord);
    minuteWords.push(nextMinuteCoord);
    nextMinuteCoord = [random(0, windowWidth), random(0,windowHeight)];
}

function drawHour(){
    drawWord(HOUR, HOUR_SIZE, HOUR_COLOR, nextHourCoord);
    hourWords.push(nextHourCoord);
    nextHourCoord = [random(0, windowWidth), random(0,windowHeight)];    
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