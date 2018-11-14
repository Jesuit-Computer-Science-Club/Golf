let x; // The x position of the ball
let y; // The y position of the ball
let vel_x;
let vel_y;
let radius;
let click_multiplier;
let animation;
let hole_x; // The x position of the hole
let hole_y; // The y position of the hole
let hole_radius;
let width; // The width of the canvas
let height; // The height of the canvas
//let level = 12;
let speed_slider; // Speed control slider
let max_dist;
let obstacles;
let level = 0;

let levels = {
  "1": {
    
  },
  
  "2": {
  
  }
}

const LEFT = 0;
const TOP = 1;
const RIGHT = 2;
const BOTTOM = 3;

// Runs on page load
function setup() {
  frameRate(30);
  width = 600;
  height = 400;
  x = 25;
  y = 25;
  hole_x = width / 2;
  hole_y = height / 2;
  vel_x = 0;
  vel_y = 0;
  hole_radius = 25;
  radius = 10;
  click_multiplier = 0.5;
  animation = -1;
  max_dist = 6 * radius;
  obstacles = [];
  
  obstacles.push(createObstacle(300, 200, 50, 100));
  obstacles.push(createObstacle(100, 50, 100, 50));
  
  createCanvas(width, height);
  
  speed_slider = document.createElement("input");
  speed_slider.setAttribute("type", "range");
  speed_slider.setAttribute("max", "1.0");
  speed_slider.setAttribute("min", "0.0");
  speed_slider.setAttribute("step", "0.01");
  speed_slider.value = click_multiplier;
  document.body.append(speed_slider);
  resetBall();
}

// Runs once per frame
function draw() {
  
  // console.log("Potential Velocity Added: " + Math.hypot(velXAdded(), velYAdded()))
  
  // Updating
  click_multiplier = speed_slider.value; // Set click multiplier equal to value of slider
  
  if (!hole()) {
    updatePosition();
  }
  
  // Drawing
  background("green"); // Backgroud
  stroke("black"); // Hole outline
  fill("black"); // Hole color
  ellipse(hole_x, hole_y, hole_radius*2, hole_radius*2); // Hole
  stroke("black");
  fill("white");
  ellipse(x, y, (radius-animation)*2, (radius-animation)*2);
  
  obstacles.forEach(drawObstacle);
}

function distTo(x0, y0, x1, y1) {
  return Math.hypot(x1 - x0, y1 - y0);
}

function hole() {
  if (distTo(x, y, hole_x, hole_y) >= hole_radius-4) return false;
  if (animation > radius) {
    resetBall();
    
    return false;
  }
  if (animation == -1) { animation = 0; return true; } // This is the first frame of the hole
  animation += 1;
  return true;
}

function updatePosition() {
  x += vel_x;
  y += vel_y;
  bounce();
  obstacles.forEach(collideObstacle);
  // Friction
  vel_x *= 0.96;
  vel_y *= 0.96;
}

function bounce() {
  if (x < radius) {
    x = radius;
    vel_x *= -1;
  }
  if (y < radius) {
    y = radius;
    vel_y *= -1;
  }
  if (x > width - radius) {
    x = width - radius;
    vel_x *= -1;
  }
  if (y > height - radius) {
    y = height - radius;
    vel_y *= -1;
  }
}

function mousePressed() {
  if ((Math.abs(vel_x) + Math.abs(vel_y)/2) < 0.2) {
   vel_x += velXAdded();
   vel_y += velYAdded(); 
  }
}

function velXAdded() {
  if (!mouseInBounds()) return 0;
  let dx = x - mouseX;
  let dist = distTo(x, y, mouseX, mouseY);
  let speed = click_multiplier * Math.min(dist, max_dist);
  return speed * dx / dist;
}

function velYAdded() {
  if (!mouseInBounds()) return 0;
  let dy = y - mouseY;
  let dist = distTo(x, y, mouseX, mouseY);
  let speed = click_multiplier * Math.min(dist, max_dist);
  return speed * dy / dist;
}

function resetBall() {
  x = 50;
  y = 50;
  vel_x = 0;
  vel_y = 0;
  animation = -1;
  level += 1;
}

function mouseInBounds() {
  return mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height; 
}

function createObstacle(x, y, width, height) {
  return {
    x: x,
    y: y,
    width: width,
    height: height
  };
}

function drawObstacle(obstacle) {
  color("white");
  rect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

function circleInRectangle(circle_x, circle_y, radius, rect_x, rect_y, rect_width, rect_height) {
  return      circle_x + radius >= rect_x
          &&  circle_x - radius <= rect_x + rect_width
          &&  circle_y + radius >= rect_y
          &&  circle_y - radius <= rect_y + rect_height
}

function collideObstacle(obstacle) {
  if (circleInRectangle(x, y, radius, obstacle.x, obstacle.y, obstacle.width, obstacle.height)) {
    let raycast_x = x - vel_x;
    let raycast_y = y - vel_y;
    let quarter_vel_x = vel_x / 4;
    let quarter_vel_y = vel_y / 4;
    while (!circleInRectangle(raycast_x, raycast_y, radius, obstacle.x, obstacle.y, obstacle.width, obstacle.height)) {
      raycast_x += quarter_vel_x;
      raycast_y += quarter_vel_y;
    }
    for (let i = 0; i < 4; i++) {
      switch(i) {
        case LEFT:
          if (raycast_x - obstacle.x < radius) {
            vel_x *= -1;
          }
        break;
        case TOP:
          if (raycast_y - obstacle.y < radius) {
            vel_y *= -1;
          }
        break;
        case RIGHT:
          if (obstacle.x + obstacle.width - raycast_x < radius) {
            vel_x *= -1;
          }
        break;
        case BOTTOM:
          if (obstacle.y + obstacle.height - raycast_y < radius) {
            vel_y *= -1;
          }
        break;
      }
      x = raycast_x;
      y = raycast_y;
    }
    /*let t = (y - (obstacle.y + obstacle.height)) / vel_y;
    if (-1 <= t <= 1) {
      let x_1 = x - vel_x*t;
      if (obstacle.x <= x_1 <= obstacle.x + obstacle.width) {
        let y_1 = y - vel_y*t;
        let t_1 = radius / vel_y;
        x = x_1 + vel_x*t_1;
        y = y_1 + radius;
        vel_y *= -1;
      }
    } else {
    }*/
  }
  return false;
}
