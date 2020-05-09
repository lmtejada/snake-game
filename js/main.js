const canvas  = document.getElementById("snake-game");
const context = canvas.getContext("2d");

const square = 16;
let maxSquares = Math.floor(canvas.width / square);
let snakePosition = [];
let foodPosition;
let score = 0;
let previousScore;
let direction;
let gameRunning;
let randomizedFood;

document.addEventListener("DOMContentLoaded", () => {
    startGame();
    addEventListenerForArrowKeys();
    addEventListenerToPlayButton();
});

const startGame = () => {
    snakePosition.push({
        x: 10 * square,
        y: 10 * square
    });

    foodPosition = getFoodPosition();

    let randomTime = Math.round(Math.random() * (10000 - 4000)) + 4000;
    randomizedFood = setTimeout(() => {
        getRandomFood()
    }, randomTime);

    gameRunning = setInterval(draw, 80);
}

const getFoodPosition = () => {
    return {
        x: Math.floor(Math.random() * maxSquares) * square,
        y: Math.floor(Math.random() * maxSquares) * square
    }
}

const getRandomFood = () => {
    let randomTime = Math.round(Math.random() * (10000 - 4000)) + 4000;

    clearTimeout(randomizedFood);
    foodPosition = getFoodPosition();

    randomizedFood = setTimeout(() => {
        getRandomFood()
    }, randomTime);
}

const addEventListenerForArrowKeys = () => {
    document.addEventListener("keydown", (event) => {
        if (event.keyCode == 37 && direction !== "right") {
            direction = "left";
        } else if (event.keyCode == 38 && direction !== "down") {
            direction = "up";
        } else if (event.keyCode == 39 && direction !== "left") {
            direction = "right";
        } else if (event.keyCode == 40 && direction !== "up") {
            direction = "down";
        }
    });
}

const addEventListenerToPlayButton = () => {
    document.getElementById("play-btn").addEventListener("click", () => {
        context.canvas.width = 800;
        context.canvas.height = 800;

        maxSquares = Math.floor(canvas.width / square);

        context.clearRect(0, 0, canvas.width, canvas.height);
        document.getElementById("play-btn").style.display = "none";

        direction = null;
        snakePosition = [];
        startGame();
    });
}

const draw = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snakePosition.length; i++) {
        // Draw position for snake
        context.fillStyle = (i == 0) ? "#2160C4" : "#00d1b2";
        context.fillRect(snakePosition[i].x, snakePosition[i].y, square, square);        
    }

    // Draw position for food
    context.fillStyle = "red";
    context.fillRect(foodPosition.x, foodPosition.y, square, square);

    updateSnakeStatus();
}

const updateSnakeStatus = () => {
    // Get last position of snake head
    let snakeHeadX = snakePosition[0].x;
    let snakeHeadY = snakePosition[0].y;

    // Change direction of snake
    switch (direction) {
        case "left":
            snakeHeadX -= square;
            break;

        case "right":
            snakeHeadX += square;
            break;

        case "up":
            snakeHeadY -= square;
            break;

        case "down":
            snakeHeadY += square;
            break;
    
        default:
            break;
    }

    let updatedHead = {
        x: snakeHeadX,
        y: snakeHeadY
    }

    let snakeReachedEdge = updatedHead.x < 0 || updatedHead.x > maxSquares * square || 
                           updatedHead.y < 0 || updatedHead.y > maxSquares * square;

    if (snakeReachedEdge) {
        updateSnakeDirection();
        updateCanvas();
        updatedHead = updateSnakePosition(updatedHead);
    }

    snakeFoundFoodCheck(updatedHead);

    if (snakeCollided(updatedHead)) {
        clearInterval(gameRunning);
        clearTimeout(randomizedFood);
        previousScore = score;
        document.getElementById("play-btn").style.display = "block";
    }

    snakePosition.unshift(updatedHead);
}

const snakeFoundFoodCheck = (head) => {
    if (head.x === foodPosition.x && head.y === foodPosition.y) {
        updateScore();
        foodPosition = getFoodPosition();
    } else {
        snakePosition.pop();
    }
}

const snakeCollided = (head) => {
    for (let i = 0; i < snakePosition.length; i++) {
        let position = snakePosition[i];
        if (head.x === position.x && head.y === position.y) {
            return true;
        }
    }
    return false;
}

const updateSnakeDirection = () => {
    if (direction === "right") {
        direction = "left";
    } else if (direction === "left") {
        direction = "right";
    } else if (direction === "up") {
        direction = "down";
    } else if (direction === "down") {
        direction = "up";
    }
}

const updateCanvas = () => {
    if (maxSquares > 20) {
        context.canvas.width = canvas.width - 113;
        context.canvas.height = canvas.height - 113;

        maxSquares = Math.floor(canvas.width / square);

        foodPosition = getFoodPosition();
    }
}

const updateSnakePosition = (head) => {
    if (head.x < 0) {
        return {
            x: head.x + 8 * square,
            y: head.y
        }
    }

    if (head.x > maxSquares * square) {
        return {
            x: head.x - 8 * square,
            y: head.y > maxSquares * square ? maxSquares * square : head.y
        }
    }

    if (head.y < 0) {
        return {
            x: head.x,
            y: head.y + 8 * square
        }
    }

    if (head.y > maxSquares * square) {
        return {
            x: head.x > maxSquares * square ? maxSquares * square : head.x,
            y: head.y - 8 * square
        }
    }
}

const updateScore = () => {
    let scoreElement = document.getElementById("score-message");
    score++;
    scoreElement.innerHTML = `Your score: ${score}`;
    
    if (score > previousScore) {
        scoreElement.classList.add("has-text-success");
    }

}