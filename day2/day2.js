let tiles = [];

let options = {
    tiling_factor: 8,
    tile_levels: 10
}

let oldFactor = options.tiling_factor;
let oldLevels = options.tile_levels;
    

function setup(){
    const gui = new dat.GUI();
    gui.add(options, 'tile_levels', 1, 20, 1);
    gui.add(options, 'tiling_factor', 2, 100, 1);
    createCanvas(windowWidth, windowHeight);

    tiles = generateTiles();
    frameRate(15);
    noFill();
}

function draw(){
    background(255);

    size = tileSize();

    if (oldFactor != options.tiling_factor || oldLevels != options.tile_levels){
        oldFactor = options.tiling_factor;
        oldLevels = options.tile_levels;
        tiles = generateTiles();
    }

    rotateHoveredTile();

    tiles.forEach(row => {
        row.forEach(tile => {
            drawTile(tile.x, tile.y, size, tile.circles, tile.mode);
        })
    });
    // put the effective drawing with the array here    
}

function rotateHoveredTile(){
    if (mouseX == 0 && mouseY == 0){
        return;
    }

    let x = floor(mouseX/tileSize());
    let y = floor(mouseY/tileSize());
    let size = tileSize();
    
    let tile = tiles[x][y];
    let newTileMode;
    // Edge cases
    if (tile.mode == 4 || tile.mode == 1){
        newTileMode = ceil(random(0,4))
    }
    else{
        newTileMode = floor(tile.mode + random(-1, 1.9))
    }   
    //generate completely new Tile, so the center of the Arcs is calcuated properly
    tiles[x][y] = generateTileObject(size*x, size*y, size, options.tile_levels, newTileMode);
}

function tileSize(){
    return windowHeight/floor(options.tiling_factor);
}

function generateTiles(){
    // save the width and tilesize at the beginning, so there are no bugs while resizing.
    let wWidth = windowWidth;
    let size = tileSize();
    result = [];
    result.length = Math.ceil(wWidth/size);

    for(let col = 0; col < Math.ceil(wWidth/size); col++){
        result[col] = [];
        result[col].length = floor(options.tiling_factor);
        for(let row = 0; row < options.tiling_factor; row++){
            result[col][row] = generateTileObject(size*col, size*row, size, options.tile_levels, ceil(random(0,4)));
        }
    }
    
    return result;
}

function generateTileObject(topLeftX, topLeftY, size, levels, tileMode){
    if (tileMode > 4 || tileMode < 1){
        console.error("Illegal Tilemode, must be between 1 and 4 is " + tileMode);
        return;
    }

    let middleX;
    let middleY;

    switch (tileMode) {
        case 1:
            middleX = topLeftX;
            middleY = topLeftY;
            break;
        case 2: 
            middleX = topLeftX + size;
            middleY = topLeftY;
            break;
        case 3:             
            middleX = topLeftX + size;
            middleY = topLeftY + size;
            break;
        case 4:
            middleX = topLeftX;
            middleY = topLeftY + size;
            break;
    }

    let tile = {
        x: middleX,
        y: middleY,
        circles: levels,
        mode: tileMode,
    }
    return tile;
}

function drawTile(middleX, middleY, size, levels, tileMode, angle = 0){
    for(let level = 1; level <= levels; level ++){
        let arcsize = size * (level/levels) * 2;
        arc(middleX, middleY, arcsize, arcsize, radians(90*(tileMode - 1)), radians(90*tileMode));
    }    
}