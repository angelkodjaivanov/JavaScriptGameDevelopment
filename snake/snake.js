const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const squareSize = 20;
const rows = 20;
const columns = 20;
const bgColor = "white";
let appleX = 0;
let appleY = 0;
const appleColor = "red";
let lastMove = "right";
let gameOver = false;

//Draws a square
function drawSquare(startX, startY, color){
    context.fillStyle = color;
    context.fillRect(startX * squareSize, startY * squareSize, squareSize, squareSize);
    context.strokeStyle = "black";
    context.strokeRect(startX * squareSize, startY * squareSize, squareSize, squareSize);
}

//Draws a board with 20x20 white squares
function drawBoard(){
    for(i = 0; i < rows; i++){
        for(j = 0; j < columns; j++){
            drawSquare(j, i, bgColor);
        }
    }
}

drawBoard();

//Creating class Snake
class Snake{
    constructor(){
        this.x = 5;
        this.y = 5;
        this.size = 1;
        this.color = "green";
        this.tail = [];
        this.tail[0] = [2];
        this.tail[0][0] = this.x;
        this.tail[0][1] = this.y;
    }
}

//This draws the snake after every move
Snake.prototype.drawSnake = function(changeX, changeY){
    drawSquare(this.tail[this.size - 1][0], this.tail[this.size - 1][1], bgColor);
    drawSquare(this.x, this.y, this.color);  
}

//The movement logic of the snake
Snake.prototype.movement = function(){
    if(this.x == appleX && this.y == appleY){
        spawnApple();
        this.tail[this.size] = [2];
        for(i = this.size; i >= 1 ; i--){
            this.tail[i][0] = this.tail[i - 1][0];
            this.tail[i][1] = this.tail[i - 1][1];
        }
        this.tail[0][0] = this.x;
        this.tail[0][1] = this.y;
        drawSquare(this.tail[0][0],  this.tail[0][1], this.color);
        this.size++;
    }
    else{
        this.drawSnake(0, -1);
        if(this.tail.length > 1){
            for(i = this.size - 1; i >= 1 ; i--){
                this.tail[i][0] = this.tail[i - 1][0];
                this.tail[i][1] = this.tail[i - 1][1];
            }
        }
        this.tail[0][0] = this.x;
        this.tail[0][1] = this.y;
    }
}

//Function that checks if we hit a wall or eat our tail
Snake.prototype.check = function(){
    if(this.x >= 20 || this.x < 0 || this.y >= 20 || this.y < 0){
        alert("Game Over");
        gameOver = true;
    }
    for(i = 0; i < this.tail.length; i++){
        if(this.x == this.tail[i][0] && this.y == this.tail[i][1]){
            alert("Game Over");
            gameOver = true;
        }
    }
}

//Move up function
Snake.prototype.moveUp = function(){
    this.y--;
    this.check();
    this.movement();
    lastMove = "up";
}

//Move down function
Snake.prototype.moveDown = function(){
    this.y++;
    this.check();
    this.movement();
    lastMove = "down";
}

//Move right function
Snake.prototype.moveRight = function(){
    this.x++;
    this.check();
    this.movement();
    lastMove = "right";
}

//Move left function
Snake.prototype.moveLeft = function(){
    this.x--;
    this.check();
    this.movement();
    lastMove = "left";
}

//Checks if a square is part of our tail(used for the apple)
Snake.prototype.isInTail = function(x, y){
    for(i = 0; i < this.tail.length; i++){
        if(x == this.tail[i][0] && y == this.tail[i][1]){
            return true;
        }
    }
    return false;
}

let snake = new Snake();
snake.drawSnake();

//Function that spawns an apple on the grid
function spawnApple(){
    do{
        appleX = Math.floor(Math.random() * 20);
        appleY = Math.floor(Math.random() * 20);    
    }while(snake.isInTail(appleX, appleY));
    drawSquare(appleX, appleY, appleColor);
}

spawnApple();
document.addEventListener("keydown", Control);

//Control function
function Control(event){
    if(event.keyCode == 37){
        snake.moveLeft();
        moveStart = Date.now();
    }else if(event.keyCode == 38){
        snake.moveUp();
        moveStart = Date.now();
    }else if(event.keyCode == 39){
        snake.moveRight();
        moveStart = Date.now();
    }else if(event.keyCode == 40){
        snake.moveDown();
        moveStart = Date.now();
    }
}

//Move function
let moveStart = Date.now();
function move(){
    let now = Date.now();
    let delta = now - moveStart;
    if(delta > 500){
        switch(lastMove){
            case "left":
                snake.moveLeft();
                break;
            case "right":
                snake.moveRight();
                break;
            case "up":
                snake.moveUp();
                break;
            case "down":
                snake.moveDown();
                break;        
        }
        moveStart = Date.now();
    }
    if(!gameOver){
        requestAnimationFrame(move);
    }
    else{
        drawBoard();
        lastMove = "right";
        snake = new Snake();
        spawnApple();
        alert("New Game! Enjoy!");
        gameOver = false;
        move();
    }
}

move();