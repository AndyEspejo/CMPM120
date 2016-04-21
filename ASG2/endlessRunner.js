var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
obstacles = [];
bgImage  = new Image();
bgImage.src = "http://people.ucsc.edu/~aespejo/120/ASG2/TilingSeabed.png";

var score = 0;
//The obstacle object, can be used to produce different types of obstacles
function Obstacle(lifeTime, speed, width, height, x, y, period) {
    this.speed = speed;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.period = period;
    
    var trashImage = new Image();
    trashImage.src = "http://people.ucsc.edu/~aespejo/120/ASG2/plasticBottle.png";
    this.trashImage = trashImage;
    this.draw = function(x, y){
    	context.drawImage(trashImage, x, y);
    }
}

//Object for the playable fish
function PlayerFish(src, x, y){
    var hp = 100;
    var is_alive = true;
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = src;
}

//Takes in a number and creates that number of obstacles, then puts it in the array
function obstacleSystem(numObstacles) {
    for(var i = 0; i < numObstacles; i++){
        obstacles.push(new Obstacle(Math.random()*10, 15 - Math.random()*10,
            10, 10, canvas.width, Math.random()*canvas.height,10 ))
    }
}

obstacleSystem(10);
var player = new PlayerFish("http://people.ucsc.edu/~aespejo/120/ASG2/Fish2.png", 0, 0);


function draw() {
    context.drawImage(bgImage, 0, 0);
    context.fillText(score,400,50);

    contextfont="20px Georgia";
    context.drawImage(player.image, player.x, player.y);
    for(var i = 0; i < obstacles.length; i++){
        var obst  = obstacles[i];
        obst.draw(obst.x, obst.y);
    }
}

document.addEventListener("keydown", handleKeyDown);

function handleKeyDown(e) {
    switch(e.keyCode){
        case 37: player.x -= 5;
        break;
        case 39: player.x += 5;
        break;
        case 38: player.y -= 5;
        break;
        case 40: player.y += 5;
        break;
    }



}
function update() {
    //Update for the obstacles
    for(var i = 0; i < obstacles.length; i++){
        if( obstacles[i].x > 0 && obstacles[i].period >= 0) {
            obstacles[i].x -= obstacles[i].speed;
            obstacles[i].y += obstacles[i].speed * .3;
            obstacles[i].period--;
            if(obstacles[i].period == 0 ) {
                obstacles[i].period = -10;
            }
        }else if(obstacles[i].x > 0 && obstacles[i].period < 0){
            obstacles[i].x -= obstacles[i].speed;
            obstacles[i].y -= obstacles[i].speed * .3;
            obstacles[i].period++;
            if(obstacles[i].period == 0 ) {
                obstacles[i].period = 10;
            }
        }else{
            obstacles[i].x = canvas.width;
            obstacles[i].lifeTime = canvas.width;
            obstacles[i].y = Math.random()*canvas.height;
            obstacles[i].period = 10;
            score += 1;
        }
        if(isCollide(player,obstacles[i])){
            player.hp -= 1;
            console.log("COLLISION");
        }
    }
    //Checking if fish collides with obstacles



}

function isCollide(pFish, trash) {
    if(pFish.x < trash.x + trash.trashImage.width &&
        pFish.x + pFish.image.width > trash.x &&
        pFish.y < trash.y + trash.trashImage.height &&
        pFish.y + pFish.image.height > trash.y){
        return true;
    }else{
        return false;
    }
}

function game_loop() {
    update();
    draw();

}

setInterval(game_loop, 60);
