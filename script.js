const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

// Configuración del juego
const gridSize = 20;
const canvasSize = 400;
const initialSnakeSize = 2;
const moveInterval = 100;

let snake = [];
let direction;
let food;
let gameLoop;
let score = 0;

// Moverse
function moveUp() {
  if (direction !== "down") {
    direction = "up";
  }
}

function moveDown() {
  if (direction !== "up") {
    direction = "down";
  }
}

function moveLeft() {
  if (direction !== "right") {
    direction = "left";
  }
}

function moveRight() {
  if (direction !== "left") {
    direction = "right";
  }
}

// Inicializar el juego
function init() {
    direction = "right";
    snake = [];
    score = 0;
    createSnake();
    createFood();

    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(update, moveInterval);
}

// Crear la serpiente inicial
function createSnake() {
    for (let i = initialSnakeSize - 1; i >= 0; i--) {
        snake.push({ x: i, y: 0 });
    }
}

// Crear la comida
function createFood() {
    const maxPos = gridSize - 1;
    let validPos = false;

    while (!validPos) {
        const xPos = Math.floor(Math.random() * gridSize);
        const yPos = Math.floor(Math.random() * gridSize);

        validPos = true;

        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === xPos && snake[i].y === yPos) {
                validPos = false;
                break;
            }
        }

        if (validPos) {
            food = { x: xPos, y: yPos };
        }
    }
}

// Actualizar el estado del juego en cada iteración
function update() {
    const head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
        case "right":
            head.x++;
            break;
        case "left":
            head.x--;
            break;
        case "up":
            head.y--;
            break;
        case "down":
            head.y++;
            break;
    }

    // Verificar colisiones
    if (checkCollisionWithBorder(head) || checkCollisionWithSelf(head)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        // La serpiente come la comida y aumenta de longitud
        score++;
        createFood();
    } else {
        snake.pop();
    }

    draw();
    drawScore();
}

// Verificar si la serpiente colisiona con los bordes del canvas
function checkCollisionWithBorder(head) {
    return (
        head.x < 0 ||
        head.x >= gridSize ||
        head.y < 0 ||
        head.y >= gridSize
    );
}

// Verificar si la serpiente colisiona consigo misma
function checkCollisionWithSelf(head) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

// Dibujar el juego en el canvas
function draw() {
    context.clearRect(0, 0, canvasSize, canvasSize);

    for (let i = 0; i < snake.length; i++) {
        drawSnakePart(snake[i].x, snake[i].y);
    }

    drawFood(food.x, food.y);
}

// Dibujar una parte de la serpiente
function drawSnakePart(x, y) {
    context.fillStyle = "rgb(0,86,6)";
    context.fillRect(
        x * gridSize,
        y * gridSize,
        gridSize,
        gridSize
    );
}

// Dibujar la comida
function drawFood(x, y) {
    context.fillStyle = "#f00";
    context.fillRect(
        x * gridSize,
        y * gridSize,
        gridSize,
        gridSize
    );
}

// Dibujar la puntuación
function drawScore() {
    context.fillStyle = "#000";
    context.font = "16px Arial";
    context.fillText("Score: " + score, 10, 20);
}

// Controlar la dirección de la serpiente
document.addEventListener("keydown", function (event) {
    const key = event.keyCode;

    switch (key) {
        case 37:
            if (direction !== "right") direction = "left";
            break;
        case 38:
            if (direction !== "down") direction = "up";
            break;
        case 39:
            if (direction !== "left") direction = "right";
            break;
        case 40:
            if (direction !== "up") direction = "down";
            break;
    }
});

// Función de Game Over
function gameOver() {
    clearInterval(gameLoop);
    alert("Game Over. Your score: " + score);
}

// Iniciar el juego
init();
