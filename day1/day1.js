let CANVASSIDE = 800;
let GRID_DIVIDER = 30;
let GRID_STEP = CANVASSIDE / GRID_DIVIDER;

// this will be incremented with each new frame to create a rolling effect
let shapeangle = 0;


function setup() {
    createCanvas(CANVASSIDE, CANVASSIDE);
    background(255);
    noFill();
    frameRate(1);
}


function draw() {
    
    background(255);
    // draw a amount of lines of random shapes
    for(let line = 0; line <= GRID_DIVIDER; line++){
        for(let col = 0; col <= GRID_DIVIDER; col++){
            ownPolygon(random(3, 6), GRID_STEP/2, GRID_STEP*col, GRID_STEP*line, shapeangle);
            console.log("tried calling Polygon");
        }
    }   
    shapeangle++;
}

function ownPolygon(sides, radius, middleX, middleY, startangle){
    let hasPrevious = false;
    let previousX = -1;
    let previousY = -1;
    let firstX = -1;
    let firstY = -1;

    for(let i = 0; i < sides; i++){
      // the angle has to be converted from degrees to radians for the Math.sin and Math.cos
      let angle = i*((360/sides)*Math.PI/180) + startangle; 
  
      let distanceY = radius*Math.sin(angle);
      let distanceX = radius*Math.cos(angle);
      
      if (hasPrevious){
        line(middleX + distanceX, middleY + distanceY,previousX, previousY)
      } else {
        firstX = middleX + distanceX;
        firstY = middleY + distanceY
      }
  
      hasPrevious = true;
      previousX = middleX + distanceX;
      previousY = middleY + distanceY
    }
    
    line(previousX, previousY, firstX, firstY);
    console.log("enteredOwn Polygon" + sides + " " + radius + " " + middleX + middleY);
}  

//for Exercise 3, all basic shapes inherently possible with p5
function drawAllShapes(){
    line(70, 400, 120, 300);
    triangle(100, 400, 150, 300, 200, 400);
    rect(420, 300, 80, 100)
    square(520, 300, 100);
    quad(640, 350, 680, 400, 720, 350, 680, 300)
    ellipse(250, 350, 80, 100);
    circle(350, 350, 100);
    arc(350, 350, 780, 780, radians(350), radians(10));
}