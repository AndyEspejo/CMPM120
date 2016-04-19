var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
obstacles = [];

//The obstacle object, can be used to produce different types of obstacles
function Obstacle(lifeTime, speed, color, width, height, x, y, period) {
    this.lifeTime = lifeTime;
    this.speed = speed;
    this.color = color;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.period = period;
}

//Object for the playable fish
function PlayerFish(src){
    var hp = 100;
    var image = new Image();
    image.src = src;
    
    this.draw = function(x, y){
	context.drawImage(image, x, y,);	
    }
    
    this.update = function(){
    	while(hp > 0){
    	//Add movement
    	}
    }
    
}

//Takes in a number and creates that number of obstacles, then puts it in the array
function obstacleSystem(numObstacles) {
    for(var i = 0; i < numObstacles; i++){
        obstacles.push(new Obstacle(Math.random()*10, 15 - Math.random()*10, "red",
            10, 10, canvas.width, Math.random()*canvas.height,10 ))
    }
}

obstacleSystem(10);
var player = new PlayerFish("http://people.ucsc.edu/~aespejo/120/ASG2/Fish2.png";


function draw() {
    canvas.width = canvas.width;
    context.fillStyle = 'blue';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    player.draw(0,0);
    for(var i = 0; i < obstacles.length; i++){
        var obst  = obstacles[i];
        context.fillStyle = "red";
        context.rect(obst.x, obst.y, obst.width, obst.height);
        context.fill();
    }
}

function update() {
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
        }
    }

}

function game_loop() {
    update();
    draw();

}

setInterval(game_loop, 60);
