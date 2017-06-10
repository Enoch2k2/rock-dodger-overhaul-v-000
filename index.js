const GAME_HEIGHT = 600;
const GAME_WIDTH = 600;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const animate = window.requestAnimationFrame;
const stopAnimate = window.cancelAnimationFrame;
const ROCKS = [];
const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const BACKGROUNDS = [];

var background, nextBackground, dodger, gameInteveral, leftKeyPressed, rightKeyPressed, score, won, update, draw;

function Start(){
  resetBackground();
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
  updateBackgrounds();
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
  drawBackgrounds();
  renderScore();
  rocksDraw();
  dodger.draw();
  animate(Draw);
}

function drawBackgrounds(){
  BACKGROUNDS.forEach(bg => bg.draw());
}

function updateBackgrounds(){
  BACKGROUNDS.forEach((bg, i) => {
    if(bg.y > GAME_HEIGHT){
      BACKGROUNDS.splice(i, 1);
      BACKGROUNDS.push(new Background(-GAME_HEIGHT))
    } else {
      bg.update();
    }
  })
  background = BACKGROUNDS[0];
  nextBackground = BACKGROUNDS[1];
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
  var dodgerRightEdge, dodgerLeftEdge, rockRightEdge, rockLeftEdge, gameHeight;
  if(rock.type == 'smallRock'){
    dodgerRightEdge = dodger.x + 70;
    dodgerLeftEdge = dodger.x + 10;

    rockRightEdge = rock.x + 40;
    rockLeftEdge = rock.x;

    gameHeight = GAME_HEIGHT - 40;
    if(rock.y > gameHeight){
      // check rock if it collides between left and right edge of dodger
      if(rockLeftEdge >= dodgerLeftEdge && rockLeftEdge <= dodgerRightEdge && rockRightEdge >= dodgerLeftEdge && rockRightEdge <= dodgerRightEdge){
        return true;
      } else if(rock.y > gameHeight + 20 && rockRightEdge >= dodgerLeftEdge && rockLeftEdge <= dodgerLeftEdge){
        return true;
      } else if(rock.y > gameHeight + 20 && rockLeftEdge <= dodgerRightEdge && rockRightEdge >= dodgerRightEdge){
        return true;
      }
    }
  } else {
    dodgerRightEdge = dodger.x + 70;
    dodgerLeftEdge = dodger.x + 10;

    rockRightEdge = rock.x + 60;
    rockLeftEdge = rock.x;

    gameHeight = GAME_HEIGHT - 80;
    if(rock.y > gameHeight){
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
}

function endGame(){
  clearInterval(gameInteveral);
  removeDodgerControls();
  while(BACKGROUNDS.length){BACKGROUNDS.pop()}
  while(ROCKS.length){ROCKS.pop()}
  stopAnimate(update);
  stopAnimate(draw);
  update = undefined;
  draw = undefined;
  resetBackground();
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
    background.draw();
    renderStart("red");
  } else {
    background.draw();
    renderStart("#FFF");
  }
}

function retryColor(e){
  if(e.clientX > 255 && e.clientX < 350 && e.clientY > 280 && e.clientY < 310){
    background.draw();
    renderRetry("red");
  } else {
    background.draw();
    renderRetry("#FFF");
  }
}

function renderStart(color){
  ctx.fillStyle = color;
  ctx.font = "30px Verdana";
  ctx.fillText("Start", 250, 200);
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
  var rock = Math.floor(Math.random()* 100) > 50 ? new BigRock(x) : new SmallRock(x);
  ROCKS.push(rock);
}

class Rock{
  constructor(x){
    this.x = x;
    this.y = 0;
    this.width = 50;
    this.height = 50;
  }

  draw(){
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update(){
    this.y += 4;
  }
}

class BigRock extends Rock{
  constructor(x){
    super(x);
    this.width = 60;
    this.height = 60;
    this.type = 'bigrock';
    this.image = document.getElementById('bigrock');
  }
}

class SmallRock extends Rock{
  constructor(x){
    super(x);
    this.type = 'smallRock';
    this.image = document.getElementById('rock');
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

function resetBackground(){
  background = new Background(0);
  nextBackground = new Background(-GAME_HEIGHT);
  BACKGROUNDS.push(background);
  BACKGROUNDS.push(nextBackground);
  background.draw();
  nextBackground.draw();
}

class Background {
  constructor(y){
    this.image = document.getElementById('background');
    this.x = 0;
    this.y = y;
  }

  update(){
    this.y += 2;
  }

  draw(){
    ctx.drawImage(this.image, 0, this.y, GAME_WIDTH, GAME_HEIGHT);
  }
}
