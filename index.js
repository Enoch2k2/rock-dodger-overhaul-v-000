const GAME_HEIGHT = 600;
const GAME_WIDTH = 600;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const animate = window.requestAnimationFrame;
const stopAnimate = window.cancelAnimationFrame;
const ROCKS = [];
const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;

var dodger, gameInteveral, leftKeyPressed, rightKeyPressed, score, won, update, draw;

function Start(){
  renderBackground();
  renderStart("#FFF");
  startMenuEvents();
}

function startMenuEvents(){
  canvas.addEventListener('mousemove', startColor);
  canvas.addEventListener('mousedown', startGame);
}

function removeStartMenuEvents(){
  canvas.removeEventListener('mousemove', startColor);
  canvas.removeEventListener('mousedown', startGame);
}

function dodgerControls(){
  document.addEventListener('keydown', moveDodger);
  document.addEventListener('keyup', stopDodger);
}

function removeDodgerControls(){
  document.removeEventListener('keydown', moveDodger);
  document.removeEventListener('keyup', stopDodger);
  leftKeyPressed = false;
  rightKeyPressed = false;
}

function retryMenuEvents(){
  canvas.addEventListener('mousemove', retryColor);
  canvas.addEventListener('mousedown', retryGame);
}

function removeRetryMenuEvents(){
  canvas.removeEventListener('mousemove', retryColor);
  canvas.removeEventListener('mousedown', retryGame);
}

function moveDodger(e){
  var key = parseInt(e.which || e.detail);
  if(key == LEFT_ARROW){
    leftKeyPressed = true;
  } else if(key == RIGHT_ARROW){
    rightKeyPressed = true;
  }
}

function stopDodger(e){
  var key = parseInt(e.which || e.detail);
  if(key == LEFT_ARROW){
    leftKeyPressed = false;
  } else if(key == RIGHT_ARROW){
    rightKeyPressed = false;
  }
}

function Update(){
  if(update){
    updateGame();
  }
}

function updateGame(){
  rocksUpdate();
  dodger.update();
  animate(Update);
}

function Draw(){
  if(draw){
    drawGame();
  }
}

function drawGame(){
  renderBackground()
  renderScore();
  rocksDraw();
  dodger.draw();
  animate(Draw);
}

function rocksUpdate(){
  ROCKS.forEach((rock, index) => {
    if(checkCollision(rock)){
      endGame();
    } else if(rock.y < GAME_HEIGHT){
      rock.update();
    } else {
      ROCKS.splice(index, 1);
      score += 1;
    }
  });
}

function rocksDraw(){
  ROCKS.forEach((rock) => rock.draw())
}

function checkCollision(rock){
  const dodgerRightEdge = dodger.x + 70;
  const dodgerLeftEdge = dodger.x + 10;

  const rockRightEdge = rock.x + 40;
  const rockLeftEdge = rock.x;

  if(rock.y > GAME_HEIGHT - 40){
    // check rock if it collides between left and right edge of dodger
    if(rockLeftEdge >= dodgerLeftEdge && rockLeftEdge <= dodgerRightEdge && rockRightEdge >= dodgerLeftEdge && rockRightEdge <= dodgerRightEdge){
      return true;
    } else if(rockRightEdge >= dodgerLeftEdge && rockLeftEdge <= dodgerLeftEdge){
      return true;
    } else if(rockLeftEdge <= dodgerRightEdge && rockRightEdge >= dodgerRightEdge){
      return true;
    }
  }
}

function endGame(){
  clearInterval(gameInteveral);
  removeDodgerControls();
  renderBackground();
  while(ROCKS.length){ROCKS.pop()}
  stopAnimate(update);
  stopAnimate(draw);
  update = undefined;
  draw = undefined;
  renderBackground();
  renderRetry("#FFF");
  retryMenuEvents();
}

function renderRetry(color){
  ctx.fillStyle = "#FFF";
  ctx.font = "30px Verdana";
  ctx.fillText(`Score: ${score}`, 225, 200);
  ctx.fillStyle = color;
  ctx.fillText("Retry?", 245, 300);
}

function startColor(e){
  if(e.clientX > 260 && e.clientX < 330 && e.clientY > 185 && e.clientY < 210){
    renderBackground();
    renderStart("red");
  } else {
    renderBackground();
    renderStart("#FFF");
  }
}

function retryColor(e){
  if(e.clientX > 255 && e.clientX < 350 && e.clientY > 280 && e.clientY < 310){
    renderBackground();
    renderRetry("red");
  } else {
    renderBackground();
    renderRetry("#FFF");
  }
}

function renderStart(color){
  ctx.fillStyle = color;
  ctx.font = "30px Verdana";
  ctx.fillText("Start", 250, 200);
}

function renderBackground(){
  var background = document.getElementById('background');
  ctx.drawImage(background, 0, 0, GAME_WIDTH, GAME_HEIGHT);
}

function renderScore(){
  ctx.fillStyle = "#FFF";
  ctx.font = "20px Verdana";
  ctx.fillText(`Score: ${score}`, 5, 25);
}

function startGame(e){
  if(e.clientX > 260 && e.clientX < 330 && e.clientY > 185 && e.clientY < 210){
    removeStartMenuEvents();
    dodgerControls();
    score = 0;
    gameInteveral = setInterval(function () {
      createRock(Math.floor(Math.random() * GAME_WIDTH - 40));
    }, 750);
    dodger = new Dodger;
    update = animate(Update)
    draw = animate(Draw);
  }
}

function retryGame(e){
  if(e.clientX > 255 && e.clientX < 350 && e.clientY > 280 && e.clientY < 310){
    removeRetryMenuEvents();
    dodgerControls();
    score = 0;
    gameInteveral = setInterval(function () {
      createRock(Math.floor(Math.random() * GAME_WIDTH - 40));
    }, 750);
    dodger = new Dodger;
    update = animate(Update)
    draw = animate(Draw);
  }
}

function createRock(x){
  var rock = new Rock(x);
  ROCKS.push(rock);
}

class Rock{
  constructor(x){
    this.x = x;
    this.y = 0;
    this.width = 40;
    this.height = 40;
    this.image = document.getElementById('rock');
  }

  update(){
    this.y += 4;
  }

  draw(){
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class Dodger {
  constructor(){
    this.x = 260;
    this.y = GAME_HEIGHT - 40;
    this.height = 40;
    this.width = 80;
    this.image = document.getElementById('ship');
  }

  update(){
    if(leftKeyPressed && this.x > 0){
      this.x -= 2;
    } else if(rightKeyPressed && this.x < (GAME_HEIGHT - 80)){
      this.x += 2;
    }
  }

  draw(){
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
