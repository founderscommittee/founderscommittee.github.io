const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const playerScoreElement = document.getElementById('player-score');
const botScoreElement = document.getElementById('bot-score');

// Game variables
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 4; // Increased ball speed
let ballSpeedY = 4; // Increased ball speed
let playerY = canvas.height / 2;
let botY = canvas.height / 2;
const paddleHeight = 80;
const paddleWidth = 10;
const playerSpeed = 5;
let playerScore = 0;
let botScore = 0;

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ball
    ctx.fillStyle = '#0f0';
    ctx.beginPath();
    ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
    ctx.fill();

    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Bounce ball off walls
    if (ballY <= 0 || ballY >= canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Check collision with paddles
    if (
        (ballX <= paddleWidth && ballY >= playerY && ballY <= playerY + paddleHeight) ||
        (ballX >= canvas.width - paddleWidth && ballY >= botY && ballY <= botY + paddleHeight)
    ) {
        ballSpeedX = -ballSpeedX;
    }

    // Score points
    if (ballX <= 0) {
        botScore++;
        botScoreElement.textContent = botScore;
        resetBall();
    } else if (ballX >= canvas.width) {
        playerScore++;
        playerScoreElement.textContent = playerScore;
        resetBall();
    }

    // Bot AI with randomness
    if (Math.random() < 0.8) { // 80% chance for the bot to follow the ball
        if (ballY < botY + paddleHeight / 2) {
            botY -= playerSpeed;
        } else {
            botY += playerSpeed;
        }
    } else { // 20% chance for the bot to move randomly
        if (Math.random() < 0.5) {
            botY -= playerSpeed;
        } else {
            botY += playerSpeed;
        }
    }

    // Draw paddles
    ctx.fillStyle = '#0f0';
    ctx.fillRect(0, playerY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, botY, paddleWidth, paddleHeight);

    requestAnimationFrame(gameLoop);
}

// Reset ball to center
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

// Move player paddle
document.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    playerY = event.clientY - rect.top - paddleHeight / 2;
});

// Start game loop
gameLoop();