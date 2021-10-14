let base;

function setup(){
    createCanvas(windowWidth, windowHeight);
    base.resize(0, windowHeight)
    base.loadPixels();
    result = averageBlocks(base, 20);
    image(result, 0, 0);
}

function averageBlocks(img, noOfBlocks){
    let size = Math.floor(Math.max(img.width, img.height)/15);
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
            oldCoords.forEach(coord => {
                if ((x >= coord[0] && x <= coord[0] + size) || (y >= coord[1] && y <= coord[1] + size)){
                    coordsOK = false;
                    return;
                } else {
                    coordsOK = true;
                }
            });
                
        } while (!coordsOK);

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
    // one loop for getting the average Color and one Loop for setting it
    for(let col = x; col <= x+width; col++){
        for(let row = y; row <= y + height; row++){
            // Calculate the pixel index * 4 because 4 color Channels
            const index = (row * img.width + col) * 4;

            // Sum the red, green, and blue values
            avgRed += img.pixels[index + 0];
            avgGreen += img.pixels[index + 1];
            avgBlue += img.pixels[index + 2];
        }
    }
    const numPixels = width*height;

    avgRed /= numPixels;
    avgGreen /= numPixels;
    avgBlue /= numPixels;

    for(let col = x; col <= x+width; col++){
        for(let row = y; row <= y + height; row++){
            // Calculate the pixel index
            const index = (row * img.width + col) * 4;

            // Sum the red, green, and blue values
            img.pixels[index + 0] = avgRed;
            img.pixels[index + 1] = avgGreen;
            img.pixels[index + 2] = avgBlue;
        }
    }

    return img;
}

function draw(){

}

function preload(){
    base = loadImage('images/Berg.JPG');
}