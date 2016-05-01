//Andy Espejo
//Snake.js
//CMPM120 ASG3

//Following code adapted from thecodeplayer.com

//Makes sure the page is ready to be manipulated
$(document).ready(function () {
    //Canvas
    var canvas = $("#canvas")[0];
    var context = canvas.getContext("2d");
    var w = $("#canvas").width();
    var h = $("#canvas").height();

    //Variables for the snake
    var cw = 10; //The width of the cell that make up the snake
    var d;       // The direction of the snake
    var score;
    var energy;
    var snakeArray; // An array of snake cells
    var canMove = true;  //Credit to Bradley Matias on Piazza for the bug fix
    var gameOver = false;

    //All of the possible pellets that appear
    var food;
    function init() {
        d = "right";
        createSnake();
        createFood();
        createEnergy();
        score = 0;
        energy = 500;
        if(typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(update, 60);
        console.log(game_loop);
    }
    init();

    //Used to create the initial snake
    function createSnake() {
        var size = 5; //Size that the snake starts at
        snakeArray = [];

        for(var i = size - 1; i >= 0; i--){
            snakeArray.push({x: i, y: 0});
        }
    }
    //Used to create food in a random location
    function createFood(){
        food = {
            x: Math.round(Math.random() * (w-cw)/cw),
            y: Math.round(Math.random() * (h-cw)/cw)
    }
    }

    //Used to create an energy pellet at a random location
    function createEnergy() {
        energyPellet = {
            x: Math.round(Math.random() * (w - cw) / cw),
            y: Math.round(Math.random() * (h - cw) / cw)
        }
    }

    function draw() {
        //Draw Background
        context.fillStyle = "green";
        context.fillRect(0,0,w,h);

        var nx = snakeArray[0].x;
        var ny = snakeArray[0].y;

        //Snake will move based on the last pressed direction
        if(d == "right") nx++;
        else if(d == "left") nx--;
        else if(d == "up") ny--;
        else if(d == "down") ny++;

        if(isGameOver(nx, ny, energy)){
            //init();
            return;
        }

        //This will check if the snake grabs an energy pellet
        if(nx == energyPellet.x && ny == energyPellet.y) {
            if (energy < 400) {
                energy += 100;
            }else{
                energy += (500-energy);
            }
            createEnergy();
        }
        //This causes movement for the snake by making the tail the new head
        //If in the current loop the snake gets food, instead of moving tail we create a new head
        //Also, if that's the case we create more food
        if(nx == food.x && ny == food.y){
            var newHead = {x: nx, y: ny};
            score++;
            createFood();
        }else{
            newHead = snakeArray.pop();
            newHead.x = nx;
            newHead.y = ny;
        }

        //This takes the above logic and sets the front of the array to the appropriate value
        snakeArray.unshift(newHead);


        //The following lines all just draw everything we need
        drawCell("food", food.x, food.y);
        drawCell("energy", energyPellet.x, energyPellet.y);
        //This loop will draw a cell for the total size of the snake
        for(var i = 0; i < snakeArray.length; i++ ) {
            var c = snakeArray[i];
            drawCell("snake", c.x, c.y)
        }
        var score_text = "Score: " + score;
        var energy_text = "Energy: " + energy/5;
        context.fillText(score_text, 5, h-5);
        context.fillText(energy_text, w-63, h-5);
    }

    function update() {
        energy--;
        canMove = true;
        if(!gameOver) {
            draw();
        }else{
            context.fillText("GAME OVER", 300, h-5);
        }



    }

    //Checks for any case where the game should end, will be checked after every movement
    function isGameOver(nx, ny, energy) {
        if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || isCollide(nx, ny, snakeArray)){
            gameOver = true
        }
        if(energy <= 0){
            gameOver = true;

        }

    }

    //Simply checks if the array has a cell inside of the given x/y range
    function  isCollide(x, y, array) {
        for(var i = 0; i < array.length; i++){
            if(array[i].x == x && array[i].y == y) {
                return true;
            }
        }
        return false;
    }
    //Used to draw food/poison etc as well as snake's body
    function drawCell(type, x, y) {
        switch(type){
            case "snake":
                context.fillStyle = "orange";
                break;
            case "food":
                context.fillStyle = "white";
                break;
            case "energy":
                context.fillStyle = "red";
                break;
            case "shrink":
                context.fillStyle = "blue";
                break;
        }

        context.fillRect(x*cw, y*cw, cw, cw);
        context.strokeStyle = "white";
        context.strokeRect(x*cw, y*cw, cw, cw);
    }

    //Controls for snake
    $(document).keydown(function (e) {
        var key = e.which;
        if(key == "37" && d != "right") d = "left";
        else if(key == "38" && d != "down") d = "up";
        else if(key == "39" && d != "left") d = "right";
        else if(key == "40" && d != "up") d = "down";
        canMove = false;


    })
})