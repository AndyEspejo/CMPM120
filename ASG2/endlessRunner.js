var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
obstacles = [];

function Obstacle(lifeTime, speed, color, width, height, x, y, period) {
    this.lifeTime = lifeTime;
    this.speed = speed;
    this.color = color;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
}


function obstacleSystem(numObstacles) {
    for(var i = 0; i < numObstacles; i++){
        obstacles.push(new Obstacle(Math.random()*10,Math.random()*10, "red",
            10, 10, canvas.width, Math.random()*canvas.height ), 2)
    }
}
obstacleSystem(50);


function draw() {
    canvas.width = canvas.width;
    context.fillStyle = 'blue';
    context.fillRect(0, 0, canvas.width, canvas.height);

    for(var i = 0; i < obstacles.length; i++){
        var obst  = obstacles[i];
        context.fillStyle = "red";
        context.rect(obst.x, obst.y, obst.width, obst.height);
        context.fill();
    }
}

function update() {
    for(var i = 0; i < obstacles.length; i++){
        if( obstacles[i].x > 0) {
            obstacles[i].x -= obstacles[i].speed;
        }else{
            obstacles[i].x = canvas.width;
            obstacles[i].lifeTime = canvas.width;
            obstacles[i].y = Math.random()*canvas.height;
        }
    }

}

function game_loop() {
    update();
    draw();

}

setInterval(game_loop, 60);