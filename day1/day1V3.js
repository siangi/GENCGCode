let CANVASSIDE = 800;
let GRID_DIVIDER = 30;
let GRID_STEP = CANVASSIDE / GRID_DIVIDER;

let LOW_SIDES = 3;
let HIGH_SIDES = 6;
let START_COLOR;
let END_COLOR;
let BACKCOLOR;

// this will be incremented with each new frame to create a rolling effect
let shapeangle = 0;
let polygons = [];


function setup() {
    //constants have to be set here because the color function can't be used earlier
    START_COLOR = color("#c471ed");
    END_COLOR = color("#f64f59");
    BACKCOLOR = color("#4A00E0");  
    createCanvas(CANVASSIDE, CANVASSIDE);
    background(255);

    frameRate(4);

    createGridOfPolygons();
}

// create Array of Polygon Objects wich will be drawn later. So you can save the state over
// multiple Frames
function createGridOfPolygons(){  
  for(let line = 0; line <= GRID_DIVIDER; line++){
    for(let col = 0; col <= GRID_DIVIDER; col++){
        let randomval = random(LOW_SIDES, HIGH_SIDES);
        let polygon = {
          sides: randomval,
          radius: GRID_STEP/2,
          middleX: GRID_STEP*col,
          middleY: GRID_STEP*line,
        }

      polygons.push(polygon);
    }
  }
}

function draw() {
    background(BACKCOLOR);
    for(let i = 0; i < polygons.length; i++){
        beginShape();
        let randomOffset =  random(-1, 1); 
        let lerpVal = (1/(HIGH_SIDES - LOW_SIDES)) + randomOffset
        let color = lerpColor(START_COLOR, END_COLOR, lerpVal);
        fill(color);
        noStroke(); 

        let points = pointPolygon(polygons[i].sides + randomOffset, polygons[i].radius, polygons[i].middleX, polygons[i].middleY, shapeangle);

        points.forEach(pnt => {
            vertex(pnt[0], pnt[1]);
        });
        endShape();
    }
    // shapeangle++;
}


function pointPolygon(sides, radius, middleX, middleY, startangle){
    let hasPrevious = false;
    let previousX = -1;
    let previousY = -1;
    let previousDistance = -1;
    let firstX = -1;
    let firstY = -1;
    let points = new Array();
    for(let i = 0; i < sides; i++){
      // the angle has to be converted from degrees to radians for the Math.sin and Math.cos
      let angle = i*((360/sides)*Math.PI/180) + startangle; 
  
      let distanceY = radius*Math.sin(angle);
      let distanceX = radius*Math.cos(angle);
      
      if (hasPrevious){
        points.push([middleX + distanceX, middleY + distanceY]);
        // points = lerpPoints(previousX, previousY, middleX + distanceX, middleY + distanceY, 20, points);
      } else {
        points.push([middleX + distanceX, middleY + distanceY]);        
        firstX = middleX + distanceX;
        firstY = middleY + distanceY;
      }
  
      hasPrevious = true;
      previousX = middleX + distanceX;
      previousY = middleY + distanceY
      previousDistance = distanceX;
    }
  
    points.push([firstX, firstY]);
    // points = lerpPoints(previousX, previousY, firstX, firstY, 20, points);
    return points;
}