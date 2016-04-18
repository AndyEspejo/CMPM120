var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
obstacles = [];

function Obstacle(lifeTime, speed, color, width, height, x, y) {
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
            10, 10, canvas.width - 100, Math.random()*canvas.height ))
    }

}

obstacleSystem(5);













function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'blue';
    context.fillRect(0, 0, canvas.width, canvas.height);

    for(var i = 0; i < obstacles.length; i++){
        var obst  = obstacles[i];
        context.fillStyle = obst.color;
        context.rect(obst.x, obst.y, obst.width, obst.height);
        context.stroke();
    }
    

}

function update() {

}

function game_loop() {
    update();
    draw();

}

setInterval(game_loop, 60);