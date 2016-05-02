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
    var cw = 25; //The width of the cell that make up the snake
    var d;       // The direction of the snake
    var score;
    var energy;
    var snakeArray; // An array of snake cells
    var canMove = true;  //Credit to Bradley Matias on Piazza for the bug fix
    var gameOver = false;
    var highScore = 0;
    var reason;

    //All of the possible pellets that appear
    var food;
    var energyPellet;
    var poisonPellet;
    var shrinkingPellet
    function init() {
        d = "right";
        createSnake();
        createFood();
        createEnergy();
        createPoison();
        createShrinking();
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

    //Used to create shrinking pellet
    function createShrinking() {
        shrinkingPellet = {
            x: Math.round(Math.random() * (w - cw) / cw),
            y: Math.round(Math.random() * (h - cw) / cw)
        }

    }

    //Used to create poison pellet in the area around a food or energy pellet
    function createPoison() {
        poisonPellet = {
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
            return;
        }

        //Checks if you touched shrinking pellet
        if(nx == shrinkingPellet.x && ny == shrinkingPellet.y) {
            snakeArray.pop();
            createShrinking()
        }
        //Checks if you touched a poison pellet
        if(nx == poisonPellet.x && ny == poisonPellet.y) {
            energy -= 100;
            createPoison();
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
            createPoison();
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
        drawCell("poison", poisonPellet.x, poisonPellet.y);
        drawCell("shrink", shrinkingPellet.x, shrinkingPellet.y);
        //This loop will draw a cell for the total size of the snake
        for(var i = 0; i < snakeArray.length; i++ ) {
            var c = snakeArray[i];
            drawCell("snake", c.x, c.y)
        }
        var score_text = "Score: " + score;
        var energy_text = "Energy: " + Math.round(energy/5);

        context.textBaseline = 'alphabetic';
        context.textAlign = "left";
        context.font = "15px Courier New bold";
        context.fillText(score_text, 5, h-5);
        context.fillText(energy_text, w-90, h-5);
    }
    
    function drawGameOver() {
        context.fillStyle = "black";
        context.fillRect(0,0,w,h);

        context.fillStyle = "red";

        context.textBaseline = 'middle';
        context.textAlign = "center";

        context.font = "35px Courier New bold";
        context.fillText("GAME OVER", w/2, 30);
        context.font = "30px Courier New Bold";
        context.fillText("High Score: " + highScore, w/2, h/2);

        context.font = "20px Courier New Bold";
        context.fillText(reason, w/2, 100);

        context.fillText("Press spacebar to restart!", w/2, h-30);

        
    }

    function update() {
        energy--;
        canMove = true;
        if(!gameOver) {
            draw();
        }else{
            if(score > highScore) highScore = score;
            drawGameOver();
        }



    }

    //Checks for any case where the game should end, will be checked after every movement
    function isGameOver(nx, ny, energy) {
        if(isCollide(nx, ny, snakeArray)){
            gameOver = true
            reason = "Tried to eat yourself ( ͡° ͜ʖ ͡°)"
        }
        if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw){
            gameOver = true;
            reason = "Crashed into the wall (ノಠ益ಠ)ノ彡┻━┻"
        }
        if(energy <= 0){
            gameOver = true;
            reason = "Ran out of energy! You need some POWERTHIRST"

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
            case "poison":
                context.fillStyle = "black";
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
        if(canMove && key == "37" && d != "right") d = "left";
        else if(canMove && key == "38" && d != "down") d = "up";
        else if(canMove && key == "39" && d != "left") d = "right";
        else if(canMove && key == "40" && d != "up") d = "down";
        else if(key ==  "32" && gameOver) {
            gameOver = false;
            init();

        }
        canMove = false;

    })
})