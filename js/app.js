// Enemies our player must avoid
var Enemy = function(StartY,Speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-ghost.png';
    this.x = -50;
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

    // Collisions
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
  if (this.moveKey === "left" && this.x > 0) {
    this.x = this.x - 101;
  }
  // move player to right
  else if (this.moveKey === "right" && this.x < 600) {
    this.x = this.x + 101;
  }
  // move player up
  else if (this.moveKey === "up"){
    this.y = this.y - 83;
    if (this.y < 50) {
      // change (WIN) need to put keys condition
      this.x = 300;
      this.y = 400;
    }
  }
  // move player down
  else if (this.moveKey === "down" && this.y < 400){
    this.y = this.y + 83;
  }
  this.moveKey = null;
};

Player.prototype.handleInput = function(moveKey){
  this.moveKey = moveKey;
  }

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Key = function(){
  this.sprite = 'images/Key.png';
  this.width = 35;
  this.height = 23;
  this.newKey();
};

Key.prototype.newKey = function(){
  var keyX = [101,202,303,404,505];
  var randomKeyX = keyX[Math.floor(Math.random() * keyX.length)];
  var keyY = [101,202,303,404];
  var randomKeyY = keyY[Math.floor(Math.random() * keyY.length)];
  this.x = randomKeyX;
  this.y = randomKeyY;
};

Key.prototype.update = function(){
  if (player.x + player.width >= this.x && player.x + player.width <= this.x + this.width){
    if (player.y + player.height >= this.y && player.y <= this.y + this.height){
      // increase the number of collected keys
      player.collectedKeys++;
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

// var Gate = function(){
//   this.sprite = "images/gate-closed.png"
//   this.x = 505;
//   this.y = 0;
// };
//
// Gate.prototype.update(){
//   if()
// };

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [
  new Enemy(60,200), new Enemy(140,300)
];

var player = new Player();

var key = new Key();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
