// Initial game setup
const gameContainer = document.getElementById('game-container');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

let gameOver = false;
let score = 0;
let isJumping = false;
let lastObstacleTime = 0;
let obstacleInterval = Math.random() * 1000 + 1000;

// Create the player
const player = {
    x: 50,
    y: canvas.height - 50,
    width: 30,
    height: 30,
    color: '#569cd6',
    velocityY: 0,
    gravity: 0.2,
    jumpForce: -7
};

// Create obstacles
const obstacles = [];

function createObstacle() {
    const height = Math.floor(Math.random() * 30) + 20;
    const obstacle = {
        x: canvas.width,
        y: canvas.height - height,
        width: 20,
        height: height,
        color: 'black'
    };
    obstacles.push(obstacle);
}

// Update game elements
function updateGame() {
    
    if (gameOver) {
        alert(`Game Over! Your score: ${score}`);
        resetGame();
        return;
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Player physics
    if (isJumping) {
        player.velocityY = player.jumpForce;
        isJumping = false;
    }

    player.velocityY += player.gravity;
    player.y = Math.min(player.y + player.velocityY, canvas.height - player.height);

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Move and draw obstacles
    const remainingObstacles = obstacles.filter(obstacle => {
        obstacle.x -= 2;

        if (obstacle.x + obstacle.width > 0) {
            ctx.fillStyle = obstacle.color;
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

            // Check for collision
            if (
                player.x < obstacle.x + obstacle.width &&
                player.x + player.width > obstacle.x &&
                player.y + player.height > obstacle.y &&
                player.y < obstacle.y + obstacle.height
            ) {
                gameOver = true;
            }
        } else {
            score += 10;
            scoreElement.textContent = `Score: ${score}`;
        }

        return obstacle.x + obstacle.width > 0;
    });

    obstacles.length = 0; // Clear obstacles array
    obstacles.push(...remainingObstacles);

    // Add new obstacles periodically
    if (Date.now() - lastObstacleTime > obstacleInterval) {
        createObstacle();
        lastObstacleTime = Date.now();
        obstacleInterval = Math.random() * 1000 + 1000;
    }

    // Repeat the update
    if (!gameOver) {
        requestAnimationFrame(updateGame);
    }

    if (gameOver) {
        alert(`Game Over! Your score: ${score}`);
        resetGame();
        return;
    }
}

// Start game loop
function startGame() {
    gameContainer.classList.remove('hidden');
    score = 0;
    scoreElement.textContent = "Score: 0";
    player.y = canvas.height - player.height;
    player.velocityY = 0;
    obstacles.length = 0; // Clear obstacles array
    lastObstacleTime = Date.now();
    updateGame();
}

// Reset game state
function resetGame() {
    gameContainer.classList.add('hidden');
    gameOver = false;
}

// Trigger game on secret action (e.g., clicking the name)
document.querySelector('h1').addEventListener('click', startGame);

// Close the game when the close button is clicked
document.getElementById('close-game').addEventListener('click', resetGame);

// Jump on spacebar press
document.addEventListener('keydown', function (e) {
    if (e.code === 'Space' && player.y === canvas.height - player.height) {
        isJumping = true;
    }
});

// Jump on screen tap (for mobile devices)
document.addEventListener('touchstart', function (e) {
    // Prevent default to avoid interference with other touch behaviors
    e.preventDefault();

    // Simulate jump if player is on the ground
    if (player.y === canvas.height - player.height) {
        isJumping = true;
    }
});