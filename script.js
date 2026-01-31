// let foodY, foodX;
// let snakeX = 4,
//   snakeY = 3;

// let snakeVelX = 0,
//   snakeVelY = 0;

// let gameOver = false;
// let intervalId;

// let snakeBody = [];
// const playboard = document.getElementById("game-area");
// let scoreValue = document.getElementById("score-value");
// let highScoreValue = localStorage.getItem("high-score-value") || 0;
// document.getElementById("high-score-value").textContent = highScoreValue;

// const changeFoodPosition = () => {
//   foodX = Math.floor(Math.random() * 30) + 1;
//   foodY = Math.floor(Math.random() * 30) + 1;
// };

// const handleGameOver = () => {
//   // clearing the timer and reloading the page
//   alert("Game Over...............");
//   clearInterval(intervalId);
//   location.reload();
// };

// const initGame = () => {
//   if (gameOver) {
//     return handleGameOver();
//   }

//   let htmlMarkup = `<div class="food" style="grid-area: ${foodY}/${foodX}"></div>`;

//   // 1. Check for Collision
//   if (snakeX == foodX && snakeY == foodY) {
//     changeFoodPosition();
//     snakeBody.push([foodX, foodY]); // Add new body part
//   }

//   // 2. SHIFT THE BODY (Must happen BEFORE head moves)
//   for (let i = snakeBody.length - 1; i > 0; i--) {
//     snakeBody[i] = snakeBody[i - 1];
//   }

//   // 3. Update the first body part to match the head's location BEFORE the head moves
//   if (snakeBody.length) {
//     snakeBody[0] = [snakeX, snakeY];
//   }

//   // 4. Move the Head
//   snakeX += snakeVelX;
//   snakeY += snakeVelY;

//   scoreValue.textContent = `${snakeBody.length}`;

//   if (Number(scoreValue.textContent) > Number(highScoreValue)) {
//     highScoreValue = scoreValue.textContent;
//     localStorage.setItem("high-score-value", highScoreValue);
//     document.getElementById("high-score-value").textContent = highScoreValue;
//   }

//   if (snakeX <= 0 || snakeX >= 30 || snakeY <= 0 || snakeY >= 30) {
//     gameOver = true;
//   }
//   // 5. Render the Head
//   htmlMarkup += `<div class="head" style="grid-area: ${snakeY}/${snakeX}"></div>`;

//   // 6. Render the Body (Fixed Loop)
//   // Start at length - 1 (the last item), and go down to 0 (the first item)
//   for (let i = 0; i < snakeBody.length; i++) {
//     htmlMarkup += `<div class="snake-body" style="grid-area: ${snakeBody[i][1]}/${snakeBody[i][0]}"></div>`;
//     //checking if head hit the body
//     if (
//       i != 0 &&
//       snakeBody[0][0] == snakeBody[i][0] &&
//       snakeBody[0][1] == snakeBody[i][1]
//     ) {
//       gameOver = true;
//     }
//   }

//   playboard.innerHTML = htmlMarkup;
// };
// changeFoodPosition();
// intervalId = setInterval(() => {
//   initGame();
// }, 125);

// const changeDirection = (e) => {
//   if (e.key === "ArrowUp" && snakeVelY != 1) {
//     snakeVelY = -1;
//     snakeVelX = 0;
//   } else if (e.key === "ArrowDown" && snakeVelY != -1) {
//     snakeVelY = 1;
//     snakeVelX = 0;
//   } else if (e.key === "ArrowLeft" && snakeVelX != 1) {
//     snakeVelY = 0;
//     snakeVelX = -1;
//   } else if (e.key === "ArrowRight" && snakeVelX != -1) {
//     snakeVelY = 0;
//     snakeVelX = 1;
//   }
// };

// document.addEventListener("keydown", changeDirection);

const playboard = document.getElementById("game-area");
const scoreElement = document.getElementById("score-value");
const highScoreElement = document.getElementById("high-score-value");
const modal = document.getElementById("game-over-modal");

let gameOver = false;
let foodX, foodY;
let snakeX = 5,
  snakeY = 5;
let snakeVelX = 0,
  snakeVelY = 0;
let snakeBody = [];
let intervalId;

// 1. FIX: Sanitize High Score to ensure it is a number.
// If it is "NaN" or null, reset to 0.
let highScore = localStorage.getItem("high-score-value");
if (!highScore || isNaN(highScore)) {
  highScore = 0;
} else {
  highScore = Number(highScore);
}
highScoreElement.innerText = highScore;

const changeFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
  clearInterval(intervalId);
  // 2. FEATURE: Show custom modal instead of alert
  modal.classList.add("show");
};

const initGame = () => {
  if (gameOver) return handleGameOver();

  let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

  // Checking if the snake hit the food
  if (snakeX === foodX && snakeY === foodY) {
    changeFoodPosition();
    snakeBody.push([foodX, foodY]);
  }

  // Moving the snake body forward
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  // Setting first body part to current head position
  if (snakeBody.length) {
    snakeBody[0] = [snakeX, snakeY];
  }

  snakeX += snakeVelX;
  snakeY += snakeVelY;

  // Checking if the snake hit the wall
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
  }

  // 3. FIX: Check collision with own body (Head vs Body)
  for (let i = 0; i < snakeBody.length; i++) {
    htmlMarkup += `<div class="snake-body" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    if (i !== 0 && snakeBody[i][0] === snakeX && snakeBody[i][1] === snakeY) {
      gameOver = true;
    }
  }

  // Rendering the head
  htmlMarkup += `<div class="head" style="grid-area: ${snakeY} / ${snakeX}"></div>`;
  playboard.innerHTML = htmlMarkup;

  // 4. FIX: Handle Score logic properly
  scoreElement.innerText = snakeBody.length;
  if (snakeBody.length > highScore) {
    highScore = snakeBody.length;
    localStorage.setItem("high-score-value", highScore);
    highScoreElement.innerText = highScore;
  }
};

changeFoodPosition();
intervalId = setInterval(initGame, 125);

const changeDirection = (e) => {
  // If game is over, any key restart the page
  if (gameOver) {
    return location.reload();
  }

  if (e.key === "ArrowUp" && snakeVelY != 1) {
    snakeVelX = 0;
    snakeVelY = -1;
  } else if (e.key === "ArrowDown" && snakeVelY != -1) {
    snakeVelX = 0;
    snakeVelY = 1;
  } else if (e.key === "ArrowLeft" && snakeVelX != 1) {
    snakeVelX = -1;
    snakeVelY = 0;
  } else if (e.key === "ArrowRight" && snakeVelX != -1) {
    snakeVelX = 1;
    snakeVelY = 0;
  }
};

document.addEventListener("keydown", changeDirection);
