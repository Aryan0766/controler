let x, y;
let px, py;
let brushSize = 4;
let drawColor;
let rainbow = false;
let previousButtons = [];

const deadzone = 0.15;
const speed = 8;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(200);
  x = width / 2;
  y = height / 2;
  px = x;
  py = y;

  drawColor = color(0);
  textAlign(CENTER, CENTER);
}

function draw() {
  const gp = navigator.getGamepads()[0];
  if (!gp) {
    // Cover the previous frame's text so it doesn't smear
    noStroke();
    fill(200);
    rect(0, height / 2 - 20, width, 40);
    fill(0);
    textSize(24);
    text("Connect a gamepad and press any button", width / 2, height / 2);
    return;
  }

  // Left stick movement with deadzone
  const dx = abs(gp.axes[0]) > deadzone ? gp.axes[0] : 0;
  const dy = abs(gp.axes[1]) > deadzone ? gp.axes[1] : 0;

  px = x;
  py = y;
  x = constrain(x + dx * speed, 0, width);
  y = constrain(y + dy * speed, 0, height);

  // Triggers control brush size (right grows, left shrinks)
  const leftTrigger = gp.buttons[6] ? gp.buttons[6].value : 0;
  const rightTrigger = gp.buttons[7] ? gp.buttons[7].value : 0;
  brushSize = map(rightTrigger - leftTrigger, -1, 1, 1, 40);

  if (rainbow) {
    drawColor = color(random(255), random(255), random(255));
  }

  stroke(drawColor);
  strokeWeight(brushSize);
  line(px, py, x, y);

  handleButtons(gp);
}

function handleButtons(gp) {
  gp.buttons.forEach((button, index) => {
    const currentlyPressed = button.pressed;
    const previouslyPressed = previousButtons[index] || false;

    if (currentlyPressed && !previouslyPressed) {
      switch (index) {
        case 0: // A: random solid color, rainbow off
          drawColor = color(random(255), random(255), random(255));
          rainbow = false;
          break;
        case 1: // B: clear canvas
          background(240);
          break;
        case 2: // X: toggle rainbow
          rainbow = !rainbow;
          break;
        case 3: // Y: save
          saveCanvas('etcha_ge', 'png');
          break;
      }
    }

    previousButtons[index] = currentlyPressed;
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(200);
}