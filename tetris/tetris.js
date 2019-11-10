const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const squareSize = 20;

//Creating the board
const rows = 20;
const columns = 10;
const vacant = "white";

let board = [rows, columns];

function drawClearBoard(){
    for(i = 0; i < rows; i++){
        board[i] = [];
        for(j = 0; j < columns; j++){
            board[i][j] = vacant;
        }
    }
}

function drawSquare(x, y, color){
    context.fillStyle = color;
    context.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
    context.strokeStyle = "black";
    context.strokeRect(x * squareSize, y * squareSize, squareSize, squareSize);
}

function drawBoard(){
    for(i = 0; i < rows; i++){
        for(j = 0; j < columns; j++){
            drawSquare(j, i, board[i][j]);
        }
    }
}

drawClearBoard();
drawBoard();

const pieces = [
    [Z,"red"],
    [S,"green"],
    [T,"brown"],
    [O,"blue"],
    [L,"purple"],
    [I,"cyan"],
    [J,"orange"]
];

//Here we generate random piece
function randomPiece(){
    let r  = Math.floor(Math.random() * pieces.length);
    return new Piece( pieces[r][0],pieces[r][1]);
}

let piece = randomPiece();


//Defining piece 
function Piece(tetromino,color){
    this.tetromino = tetromino;
    this.color = color;  
    this.tetrominoN = 0; 
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.x = 3;
    this.y = -2;
}


//Fill funtion
Piece.prototype.fill = function(color){
    for(i = 0; i < this.activeTetromino.length; i++){
        for(j = 0; j < this.activeTetromino.length; j++){
            if( this.activeTetromino[i][j]){
                drawSquare(this.x + j,this.y + i, color);
            }
        }
    }
}   

//Draw function
Piece.prototype.draw = function(){
    this.fill(this.color);
}

//Undraw function
Piece.prototype.unDraw = function(){
    this.fill(vacant);
}

//MoveDown function
Piece.prototype.moveDown = function(){
    if(!this.collision(0, 1, this.activeTetromino)){
        this.unDraw();
        this.y++;
        this.draw();
    }
    else{
        this.lock();
        piece = randomPiece();
    }
}  

//MoveRight function 
Piece.prototype.moveRight = function(){
    if(!this.collision(1, 0, this.activeTetromino)){
        this.unDraw();
        this.x++;
        this.draw();
    }
}

//MoveLeft function
Piece.prototype.moveLeft = function(){
    if(!this.collision(-1, 0, this.activeTetromino)){
        this.unDraw();
        this.x--;
        this.draw();
    }
}

//Rotate function
Piece.prototype.rotate = function(){
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0;
    
    if(this.collision(0,0,nextPattern)){
        if(this.x > columns/2){
            kick = -1;
        }else{
            kick = 1;
        }
    }
    
    if(!this.collision(kick,0,nextPattern)){
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

//Collision function
Piece.prototype.collision = function(x, y, piece){
    for (i = 0; i < piece.length; i++){
        for(j = 0; j < piece.length; j++){
            if(!piece[i][j]){
                continue;
            }

            let newX = this.x + j + x;
            let newY = this.y + i + y;
            
            if(newY < 0){
                continue;
            }

            if(newX < 0 || newX >= columns || newY >= rows){
                return true;
            }
         
            //This check if the sqaure is already taken by another piece
            if( board[newY][newX] != vacant){
                return true;
            }
        }
    }
    return false;
}

let score = 0;

//Lock function 
Piece.prototype.lock = function(){
    for(i = 0; i < this.activeTetromino.length; i++){
        for(j = 0; j < this.activeTetromino.length; j++){
            if(!this.activeTetromino[i][j]){
                continue;
            }
            if(this.y + i < 0){
                alert("Game Over");
                gameOver = true;
                break;
            }
            board[this.y+i][this.x+j] = this.color;
        }
    }

    for(i = 0; i < rows; i++){
        let isRowFull = true;
        for(j = 0; j < columns; j++){
            isRowFull = isRowFull && (board[i][j] != vacant);
        }
        if(isRowFull){
            for(y = i; y > 1; y--){
                for(j = 0; j < columns; j++){
                    board[y][j] = board[y-1][j];
                }
            }
            for(j = 0; j < columns; j++){
                board[0][j] = vacant;
            }
            score += 10;
        }
    }

    drawBoard();
    scoreElement.innerHTML = score;
}


document.addEventListener("keydown", Control);

function Control(event){
    if(event.keyCode == 37){
        piece.moveLeft();
        dropStart = Date.now();
    }else if(event.keyCode == 38){
        piece.rotate();
        dropStart = Date.now();
    }else if(event.keyCode == 39){
        piece.moveRight();
        dropStart = Date.now();
    }else if(event.keyCode == 40){
        piece.moveDown();
    }
}


let dropStart = Date.now();
let gameOver = false;
function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > 500){
        piece.moveDown();
        dropStart = Date.now();
    }
    if(!gameOver){
        requestAnimationFrame(drop);
    }
    else{
        drawClearBoard();
        drawBoard();
        gameOver = false;
        drop();
    }
}

drop();