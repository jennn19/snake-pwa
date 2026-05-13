const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

const GRID_SIZE = 20;
const TILE_COUNT = canvas.width / GRID_SIZE;

let snake = [];
let food = { x: 0, y: 0 };
let direction = { x: 0, y: 0 };
let nextDirection = { x: 0, y: 0 };
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameLoop = null;
let isRunning = false;

highScoreEl.textContent = highScore;

function initGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    scoreEl.textContent = score;
    spawnFood();
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * TILE_COUNT),
        y: Math.floor(Math.random() * TILE_COUNT)
    };
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            spawnFood();
            break;
        }
    }
}

function update() {
    direction = { ...nextDirection };
    
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    
    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
        gameOver();
        return;
    }
    
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }
    
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.textContent = score;
        spawnFood();
    } else {
        snake.pop();
    }
}

function draw() {
    ctx.fillStyle = '#0a0a15';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#1a1a2e';
    for (let i = 0; i < TILE_COUNT; i++) {
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(canvas.width, i * GRID_SIZE);
        ctx.stroke();
    }
    
    for (let i = 0; i < snake.length; i++) {
        const segment = snake[i];
        const gradient = ctx.createRadialGradient(
            segment.x * GRID_SIZE + GRID_SIZE/2,
            segment.y * GRID_SIZE + GRID_SIZE/2,
            0,
            segment.x * GRID_SIZE + GRID_SIZE/2,
            segment.y * GRID_SIZE + GRID_SIZE/2,
            GRID_SIZE/2
        );
        
        if (i === 0) {
            gradient.addColorStop(0, '#00ff88');
            gradient.addColorStop(1, '#00cc6a');
        } else {
            const alpha = 1 - (i / snake.length) * 0.5;
            gradient.addColorStop(0, `rgba(0, 255, 136, ${alpha})`);
            gradient.addColorStop(1, `rgba(0, 204, 106, ${alpha})`);
        }
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(
            segment.x * GRID_SIZE + 1,
            segment.y * GRID_SIZE + 1,
            GRID_SIZE - 2,
            GRID_SIZE - 2,
            4
        );
        ctx.fill();
    }
    
    ctx.fillStyle = '#ff4757';
    ctx.beginPath();
    ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE/2,
        food.y * GRID_SIZE + GRID_SIZE/2,
        GRID_SIZE/2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
    
    ctx.fillStyle = '#ff6b81';
    ctx.beginPath();
    ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE/2 - 3,
        food.y * GRID_SIZE + GRID_SIZE/2 - 3,
        3,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

function gameOver() {
    isRunning = false;
    clearInterval(gameLoop);
    gameLoop = null;
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreEl.textContent = highScore;
    }
    
    startBtn.style.display = 'inline-block';
    startBtn.textContent = '遊戲結束 - 再試一次';
    restartBtn.style.display = 'none';
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('遊戲結束!', canvas.width/2, canvas.height/2 - 20);
    ctx.font = '20px Arial';
    ctx.fillText(`最終分數: ${score}`, canvas.width/2, canvas.height/2 + 20);
}

function startGame() {
    if (isRunning) return;
    
    initGame();
    isRunning = true;
    startBtn.style.display = 'none';
    restartBtn.style.display = 'inline-block';
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(() => {
        update();
        draw();
    }, 100);
}

function handleDirection(dir) {
    if (!isRunning) return;
    
    switch(dir) {
        case 'up':
            if (direction.y !== 1) nextDirection = { x: 0, y: -1 };
            break;
        case 'down':
            if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
            break;
        case 'left':
            if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
            break;
        case 'right':
            if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
            break;
    }
}

document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            handleDirection('up');
            e.preventDefault();
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            handleDirection('down');
            e.preventDefault();
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            handleDirection('left');
            e.preventDefault();
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            handleDirection('right');
            e.preventDefault();
            break;
    }
});

document.querySelectorAll('.touch-controls button').forEach(btn => {
    btn.addEventListener('click', () => {
        handleDirection(btn.dataset.dir);
    });
});

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

initGame();
draw();