let x; // The x position of the ball
let y; // The y position of the ball
let vel_x;
let vel_y;
let radius;
let hole_x; // The x position of the hole
let hole_y; // The y position of the hole
let hole_radius;
let width; // The width of the canvas
let height; // The height of the canvas

// Runs on page load
function setup() {
  frameRate(60);
  width = 1000;
  height = 400;
  hole_radius = 25;
  radius = 20;
  createCanvas(width, height);
  hole_x = width / 2;
  hole_y = height / 2;
}

// Runs once per frame
function draw() {
  x = mouseX;
  y = mouseY;
  background("green");
  stroke("black");
  fill("black");
  ellipse(hole_x, hole_y, hole_radius*2, hole_radius*2);
  stroke("black");
  fill("white");
  if (distTo(x, y, hole_x, hole_y) < hole_radius) {
    fill("red");
  }
  ellipse(x, y, radius*2, radius*2);
}

function distTo(x0, y0, x1, y1) {
  return Math.hypot(x1 - x0, y1 - y0);
}
