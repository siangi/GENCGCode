let base;

const BLOCK_COUNT = 5;
const SIZE_DIVIDER = 5;

let redRand;
let greenRand;
let blueRand;

// array of functions which will filter 
let filters = [];

function setup(){
    createCanvas(windowWidth, windowHeight);
    base.resize(0, windowHeight)
    base.loadPixels();
    initFilterArray();
    result = averageBlocks(base, BLOCK_COUNT);
    image(result, 0, 0);
}

function averageBlocks(img, noOfBlocks){
    let size = Math.floor(Math.max(img.width, img.height)/SIZE_DIVIDER);
    result = img;
    let oldCoords = [];
    
        let x = 0;
        let y = 0;

    for(let i = 0; i < noOfBlocks; i++){
        let coordsOK = true;

        result.loadPixels();

        do {      
            x = Math.floor(random(0, img.width - size));
            y = Math.floor(random(0, img.height - size));

            coordsOK = true;
            // trying to stop them from overlapping, doesn't work yet.
            for (let i = 0; i < oldCoords.length; i++) {
                const coord = oldCoords[i];

                if (((x >= coord[0] && x <= coord[0] + size) || (x+size >= coord[0] && x+size <= coord[0] + size)) && 
                    ((y >= coord[1] && y <= coord[1] + size) || (y+size >= coord[1] && y+size <= coord[1] + size))){
                    coordsOK = false;
                    console.log("bad coords " + x + " " + y);
                    break;
                } else {
                    coordsOK = true;
                }
            }                
        } while (!coordsOK);

        console.log("paint with coords " + x + " " + y);
        result = averageBlock(x, y, size, size, result);
        result.updatePixels();
        oldCoords.push([x, y]);
    }

    return result;
}

function averageBlock(x, y, width, height, img){
    let avgRed  = 0;
    let avgGreen = 0;
    let avgBlue = 0;
    let filterFunc = filters[floor(random(0, filters.length - 1))];
    redRand = random(0.2, 2);
    greenRand = random(0.2, 2);
    blueRand = random(0.2, 2);
    // one loop for getting the average Color and one Loop for setting it
    for(let col = x; col <= x+width; col++){
        for(let row = y; row <= y + height; row++){
            // Calculate the pixel index * 4 because 4 color Channels
            const index = (row * img.width + col) * 4;

            filterVals = filterFunc(img.pixels[index], img.pixels[index + 1], img.pixels[index + 2]);
            img.pixels[index] = filterVals[0];
            img.pixels[index + 1] = filterVals[1];
            img.pixels[index + 2] = filterVals[2];
        }
    }

    return img;
}

function draw(){

}

function initFilterArray(){
    filters.push(glitchFilter);
    filters.push(onlyRedFilter);
    filters.push(violetFilter);
    filters.push(violetFilterTwo);
    filters.push(randomFilter);
    filters.push(grayscaleFilter);
}


function glitchFilter(red, green, blue){
    result = []; 

    if (red >= 122) {result[0] = red/2} else { result[0] = red*2}
    if (green >= 122) { result[1] = green/2 } else {result[1] = green*2}
    if (blue >= 122) { result[2] = blue/2 } else {result[2] = blue*2}

    return result
}

function onlyRedFilter(red, green, blue){
    result = [];

    newRed = red*1.5;
    result[0] = newRed;
    result[1] = newRed;
    result[2] = newRed;

    return result;
}


function violetFilter(red, green, blue){
    result = [];

    result[0] = red;
    result[1] = green/10;
    result[2] = blue*1.2;

    return result;
}


function grayscaleFilter(red, green, blue){
    result = [];

    let brightness = (red+green+blue)/3;

    result[0] = brightness;
    result[1] = brightness;
    result[2] = brightness;

    return result;
}


function violetFilterTwo(red, green, blue){
    result = [];
    
    let brightness = (red+green+blue)/3;

    result[0] = red* brightness / 15;
    result[1] = green * brightness / 75;
    result[2] = blue * brightness / 10;

    return result;
}


function randomFilter(red, green, blue){
    result = [];

    result[0] = red * redRand;
    result[1] = green * greenRand;
    result[2] = blue * blueRand;

    return result;
}

function preload(){
    base = loadImage('images/berg.jpg');
}