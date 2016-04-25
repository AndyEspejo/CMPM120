var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
document.body.style.zoom="200%";
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
    this.trashImage = trashImage;

    //Generates a random number between 1 and 4 to choose an image source
    var randomSRC = Math.floor(Math.random() * (5)) + 1;

    switch(randomSRC){
        case 1:
            trashImage.src = "http://people.ucsc.edu/~aespejo/120/ASG2/plasticBottle.png";
            break;
        case 2:
            trashImage.src = "http://people.ucsc.edu/~aespejo/120/ASG2/plasticJug.png";
            break;
        case 3:
            trashImage.src = "http://people.ucsc.edu/~aespejo/120/ASG2/glassBottle.png";
            break;
        case 4:
            trashImage.src = "http://people.ucsc.edu/~aespejo/120/ASG2/sodaCan.png";
            break;
        case 5:
            trashImage.src = "http://people.ucsc.edu/~aespejo/120/ASG2/sprayCan.png";
    }
    this.draw = function(x, y){
    	context.drawImage(trashImage, x, y);
    }
}

//Object for the playable fish
function PlayerFish(x, y, isAlive){
    this.hp = 100;
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.isAlive = isAlive;
    if(this.isAlive == true) {
        this.image.src = "http://people.ucsc.edu/~aespejo/120/ASG2/Fish2.png";
    }else{
        this.image.src =  "http://people.ucsc.edu/~aespejo/120/ASG2/FishDead.png";
    }
}

//Takes in a number and creates that number of obstacles, then puts it in the array
function obstacleSystem(numObstacles) {
    for(var i = 0; i < numObstacles; i++){
        obstacles.push(new Obstacle(Math.random()*10, 15 - Math.random()*10,
            10, 10, canvas.width, Math.random()*canvas.height,10 ))
    }
}

obstacleSystem(10);
var player = new PlayerFish(0, 200, true);
var deadPlayer = new PlayerFish( player.x, player.y, false);



document.addEventListener("keydown", handleKeyDown);

function handleKeyDown(e) {
    if(player.isAlive) {
        switch (e.keyCode) {
            case 37:
                player.x -= 5;
                break;
            case 39:
                player.x += 5;
                break;
            case 38:
                player.y -= 5;
                break;
            case 40:
                player.y += 5;
                break;
        }
    }


}

function draw() {
    context.drawImage(bgImage, 0, 0);
    var contextfont="20px Georgia";
    context.fillText("SCORE: " + score,550,20);


    if(player.hp > 0) {
        context.drawImage(player.image, player.x, player.y);
        context.fillText("Health: " + player.hp , 50, 20);
    }else{
        context.drawImage(deadPlayer.image, player.x, player.y);
        context.fillText("Health: 0"  , 50, 20);
    }
    for(var i = 0; i < obstacles.length; i++){
        var obst  = obstacles[i];
        obst.draw(obst.x, obst.y);
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
            if(player.isAlive) {
                score += 1;
            }
        }
        //update for player
        if(isCollide(player,obstacles[i])){
            player.hp -= 1;
            if(player.hp ==0){
                player.isAlive = false;
            }
            console.log("COLLISION");
            console.log(player.hp);
        }

        if(player.isAlive == false && player.y > 2){
            player.y -= .1;
        }
    }




}

//Checking if fish collides with obstacles
function isCollide(pFish, trash) {
    return pFish.x < trash.x + trash.trashImage.width &&
        pFish.x + pFish.image.width > trash.x &&
        pFish.y < trash.y + trash.trashImage.height + 5 &&
        pFish.y + pFish.image.height > trash.y + 5;
}

function game_loop() {
    update();
    draw();

}

setInterval(game_loop, 60);
