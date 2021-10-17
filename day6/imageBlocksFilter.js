let base;

const BLOCK_COUNT = 5;
const SIZE_DIVIDER = 5;

// options and their controls
let options = {
    widthDivider: 4,
    heightDivider: 1
}


// are needed to store some random Values for the randomFilter
// these can't be parameters because the filter functions are anonymous
let redRand;
let greenRand;
let blueRand;

// array of functions which will filter 
let filters = [];

// coordinates of the filterBlocksplus their size
let blocks = [];

function setup(){
    createCanvas(windowWidth, windowHeight);
    base.resize(0, windowHeight)
    base.loadPixels();

    const gui = new dat.GUI();
    gui.add(options, 'widthDivider', 1, 10, 1);
    gui.add(options, 'heightDivider', 1, 10, 1);

    initFilterArray();
    background(50);
    
    // copied = randomFilterBlocks(base, BLOCK_COUNT);
    background(255);
    let copied = base;
    copied = filterGrid(copied);
    image(copied, 0, 0);
}

// creates blocks randomly across the image
function randomFilterBlocks(img, noOfBlocks){
    let size = Math.floor(Math.max(img.width, img.height)/SIZE_DIVIDER);
    result = img;

    let x = 0;
    let y = 0;

    for(let i = 0; i < noOfBlocks; i++){
        let coordsOK = true;

        result.loadPixels();

        do {      
            x = Math.floor(random(0, img.width - size));
            y = Math.floor(random(0, img.height - size));

            coordsOK = true;

            for (let i = 0; i < blocks.length; i++) {
                const block = blocks[i]

                if (((x >= block.x && x <= block.x + size) || (x+size >= block.x && x+size <= block.x + size)) && 
                    ((y >= block.y && y <= block.y + size) || (y+size >= block.y && y+size <= block.y + size))){
                    coordsOK = false;
                    
                    break;
                } else {
                    coordsOK = true;
                }
            }                
        } while (!coordsOK);

        result = filterBlock(x, y, size, size, result);
        result.updatePixels();
        block = {
            x: x,
            y: y,
            width: size,
            height: size
        }
        blocks.push(block);
    }

    return result;
}

// creates a grid of blocks with random filters
function filterGrid(img){
    let result = img;

    blockHeight = floor(img.height/options.heightDivider);
    blockWidth = floor(img.width/options.widthDivider);
    
    for(let col = 0; col < options.heightDivider; col++){
        for(let row = 0; row < options.widthDivider; row++){
            result = filterBlock(blockWidth*row, blockHeight*col, blockWidth, blockHeight, result);
            result.updatePixels();
        }
    }
    return result;
}


function filterBlock(x, y, width, height, img){
    let avgRed  = 0;
    let avgGreen = 0;
    let avgBlue = 0;
    let filterFunc = filters[floor(random(0, filters.length))];
    redRand = random(0.9, 2);
    greenRand = random(0.9, 2);
    blueRand = random(0.9, 2);
    // one loop for getting the average Color and one Loop for setting it
    for(let col = x; col < x+width; col++){
        for(let row = y; row < y + height; row++){
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
    if (oldHeightDivider != options.heightDivider || oldWidthDivider != options.widthDivider){
        oldHeightDivider = options.heightDivider;
        oldWidthDivider = options.widthDivider;
        background(255);
        let result = base;
        result = filterGrid(base);
        result.updatePixels();
        image(result, 0, 0);
    }    
}


function initFilterArray(){
    filters.push(glitchFilter);
    filters.push(onlyRedFilter);
    filters.push(violetFilter);
    filters.push(violetFilterTwo);
    filters.push(randomFilter);
    filters.push(grayscaleFilter);
    filters.push(negativeFilter);
}

function negativeFilter(red, green, blue){
    result = [];

    result[0] = 255 - red;
    result[1] = 255 - green;
    result[2] = 255 - blue;

    return result;
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

function showImage(img){
    let result = img;
    result = filterGrid(result);
    image(result, 0, 0)
}

function preload(){
    base = loadImage('images/berg.JPG');    
}