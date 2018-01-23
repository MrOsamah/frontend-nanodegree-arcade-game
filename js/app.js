// Array of images of the player's lives
var livesImages = [
  "images/0hp.png",
  "images/1hp.png",
  "images/2hp.png",
  "images/3hp.png"
];

// Array of images of the collected allowedKeys
var keysCollectedImages = [
  "images/0keys.png",
  "images/1key.png",
  "images/2keys.png",
  "images/3keys.png",
  "images/4keys.png",
  "images/5keys.png",
  "images/6keys.png"
];

// Enemies our player must avoid
var Enemy = function(StartY,Speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-ghost.png';
    this.x = -100;
    this.y = StartY;
    this.speed = Speed;
    this.width = 90;
    this.height = 23;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // move enemies horizontally
    this.x = this.x + this.speed * dt;

    // Enemey reached the end
    if (this.x > 720){
      var startY = [60,140,220,300];
      // https://stackoverflow.com/questions/4550505/getting-a-random-value-from-a-javascript-array#4550514
      var randomStartY = startY[Math.floor(Math.random() * startY.length)];
      this.x = -150;
      this.y = randomStartY;
    }

    // Collisions with player
    // https://www.youtube.com/watch?v=DMIkh2o8xrE
    if (player.x + player.width >= this.x && player.x + player.width <= this.x + this.width){
      if (player.y + player.height >= this.y && player.y <= this.y + this.height){
        // reduce number of lives
        player.lives--;
        // reduce one key if player has at least once
        if (player.collectedKeys !== 0){
          player.collectedKeys--
        }
        // change the images of lives and collected kyes
        $("#lives").attr( "src", livesImages[player.lives]);
        $("#keys-collected").attr( "src", keysCollectedImages[player.collectedKeys]);
        // reset player's position
        player.x = 300;
        player.y = 400;
      }
    }

    // Collisions with keys
    if (key.x + key.width >= this.x && key.x + key.width <= this.x + this.width){
      if (key.y + key.height >= this.y && key.y <= this.y + this.height){
        key.newKey();
      }
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
  this.sprite = 'images/char-princess-girl.png';
  this.x = 300;
  this.y = 400;
  this.width = 50;
  this.height = 36;
  this.lives = 3;
  this.collectedKeys = 0;
};

// https://github.com/alexanderverge/frontend-nanodegree-arcade-game/blob/gh-pages/js/app.js
Player.prototype.update = function(dt){
  // move player to left
  if (this.moveKey === "left" && this.x > 0){
    // make sure it's not possiple to enter the gate from left
    if (this.y < 50 && this.x < 404 && this.x > 303){
    } else {
      this.x = this.x - 101;
    }
  }
  // move player to right
  else if (this.moveKey === "right" && this.x < 600){
    // make sure it's not possiple to enter the gate from right
    if (this.y < 50 && this.x > 101 && this.x < 202){

    } else {
      this.x = this.x + 101;
    }
  }
  // move player up
  else if (this.moveKey === "up" && this.y > 0){
    if (this.y < 100 && this.x > 202 && this.x < 303){
      if (this.collectedKeys === 6){
        this.y = this.y - 83;
        game.gameState = "win";
      }
      // (WIN)
    } else {
      this.y = this.y - 83;
    }
  }
  // move player down
  else if (this.moveKey === "down" && this.y < 400){
    this.y = this.y + 83;
  }
  // So it stops and wait for other moveKey from the lestner
  this.moveKey = null;
};

// take the moving key from the lestner and
// assigning them to the player moveKey property
Player.prototype.handleInput = function(moveKey){
  this.moveKey = moveKey;
  }

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Key class the player must collect 6 of them then go through the gate
var Key = function(){
  this.sprite = 'images/Key.png';
  this.width = 50;
  this.height = 23;
  this.newKey();
};

Key.prototype.newKey = function(){
  var keyX = [101,202,303,404,505];
  var randomKeyX = keyX[Math.floor(Math.random() * keyX.length)];
  var keyY = [60,140,220,300];
  var randomKeyY = keyY[Math.floor(Math.random() * keyY.length)];
  this.x = randomKeyX;
  this.y = randomKeyY;
};

Key.prototype.update = function(){
  if (player.x + player.width >= this.x && player.x + player.width <= this.x + this.width){
    if (player.y + player.height >= this.y && player.y <= this.y + this.height){
      // increase the number of collected keys but not more than 6 keys
      if(player.collectedKeys < 6){
        player.collectedKeys++;
      }
      // change the image to represnsent number of keys collected
      $("#keys-collected").attr("src", keysCollectedImages[player.collectedKeys]);
      // change the location of the key
      this.newKey();
    }
  }
};

Key.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Gate class the player must go through if he/she has 6 keys
var Gate = function(){
  this.sprite = "images/gate-closed.png"
  this.x = 303;
  this.y = 0;
};

Gate.prototype.update = function(){
  if(player.collectedKeys === 6){
    this.sprite = "images/gate-opened.png";
  } else {
    this.sprite = "images/gate-closed.png";
  }
};

Gate.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x,this.y);
}


var Game = function(){
  this.bg = "images/bgMenu.png";
  this.gameState = "menu";
  this.x = 0;
  this.y = 0;
};

Game.prototype.update = function(){
  if (this.gameState === "menu"){
    this.bg = "images/bgMenu.png";
    $("#startButton").show();
    $("#retryButton").hide();
  }

  if (this.gameState === "start"){
    this.bg = "images/bgStart.png";
    $("#startButton").hide();
  }

  if (player.lives === 0){
    this.gameState = "over";
    this.bg = "images/bgOver.png";
    $("#retryButton").show();
  }

  if (this.gameState === "win"){
    this.bg = "images/bgWin.png";
    $("#liveLeft").text(player.lives);
    $("#timeOfPlay").text(timer.time.getMinutes()+":"+timer.time.getSeconds()+"."+timer.time.getMilliseconds());
    $("#stats").show();
    $("#retryButton").show();
  }
};

Game.prototype.render = function() {
  ctx.drawImage(Resources.get(this.bg), this.x,this.y);
};

// Timer class used to calclate time :)
var Timer = function(){
  this.currentTime = Date.now();
  this.currentTimer = 0;
};
// https://www.youtube.com/watch?v=fF-vtP3sjPc
Timer.prototype.update = function(){
  var now = Date.now();
  var dt = now - this.currentTime;
  function pad (n) {
        return ('00' + n).substr(-2);
    }

  this.currentTimer += dt;
  this.time = new Date(this.currentTimer);
  $(".mins").text(pad(this.time.getMinutes()));
  $(".sec").text(pad(this.time.getSeconds()));
  $(".milsec").text(pad(Math.floor(this.time.getMilliseconds() / 10)));
  this.currentTime = now;
};

// Instantiate the objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// key and gate object for generating the keys and the gate
// game object to controll the flow of the game
// timer object to calculate total time spend playing

var allEnemies = [
  new Enemy(220,200), new Enemy(140,100), new Enemy(60,500),new Enemy(300,300),
  new Enemy(60,50)
];
var player = new Player();
var key = new Key();
var gate = new Gate();
var game = new Game();
var timer = new Timer();

// Click lestner to start the game
$("#startButton").click(function(){
  // Change the game state
  game.gameState = "start";
  // To make sure timer start when the user clicks the start button
  timer.currentTime = Date.now();
});

// Click lestner to refresh the page and begin again
$("#retryButton").click(function(){
  // refresh and redraw everything
  history.go(0);
});

// This listens for key presses and sends the keys
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
