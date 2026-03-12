// Game constants
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');

// Resize canvas to fill screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Initial resize and listen for window resize
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Audio System - upbeat game music
const backgroundAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
let isSoundEnabled = true;

// Game configuration
const GRAVITY = 0.3;
const JUMP_POWER = -4.5;
const PIPE_SPEED = 1.5;
const PIPE_SPAWN_INTERVAL = 180;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;

// Brand colors
const BRAND_COLORS = {
    PIPE_PRIMARY: '#790ECB',
    PIPE_CAP: '#5a0a99',
    PIPE_HIGHLIGHT: '#9a3ee0'
};

// Game state
let gameState = 'start'; // 'start', 'playing', 'gameOver'
let score = 0;
let frameCount = 0;
let highScore = 0;

// Difficulty scaling
let difficultyMultiplier = 1.0;
let lastDifficultyThreshold = 0;

// Player
const player = {
    x: 80,
    y: 0,
    width: 40,
    height: 40,
    velocity: 0,
    rotation: 0,
    image: new Image()
};

player.image.src = 'kiro-logo.png';

// Initialize player position after canvas is sized
function initPlayerPosition() {
    player.y = canvas.height / 2;
}

// Pipes array
let pipes = [];

// Audio System Functions
function initAudio() {
    backgroundAudio.loop = true;
    backgroundAudio.volume = 0.5;
    isSoundEnabled = loadSoundPreference();
}

function updateAudio() {
    if (gameState === 'playing' && isSoundEnabled) {
        backgroundAudio.play().catch(err => {
            console.log('Audio play failed:', err);
        });
    } else {
        backgroundAudio.pause();
    }
}

function loadSoundPreference() {
    const saved = localStorage.getItem('flappyKiroSoundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
}

function saveSoundPreference(enabled) {
    localStorage.setItem('flappyKiroSoundEnabled', JSON.stringify(enabled));
}

function toggleSound() {
    isSoundEnabled = !isSoundEnabled;
    saveSoundPreference(isSoundEnabled);
    updateAudio();
    updateSoundButton();
}

function updateSoundButton() {
    const soundToggle = document.getElementById('soundToggle');
    const soundIcon = soundToggle.querySelector('.sound-icon');
    
    if (isSoundEnabled) {
        soundIcon.textContent = '🔊';
        soundToggle.classList.remove('muted');
    } else {
        soundIcon.textContent = '🔇';
        soundToggle.classList.add('muted');
    }
}

// Score Persistence Functions
function saveScore(score) {
    const scores = getScoreHistory();
    scores.push({
        score: Math.floor(score),
        timestamp: Date.now()
    });
    localStorage.setItem('flappyKiroScores', JSON.stringify(scores));
}

function getScoreHistory() {
    const data = localStorage.getItem('flappyKiroScores');
    return data ? JSON.parse(data) : [];
}

function getHighScore() {
    const scores = getScoreHistory();
    if (scores.length === 0) return 0;
    return Math.max(...scores.map(s => s.score));
}

function isNewHighScore(currentScore) {
    return Math.floor(currentScore) > highScore;
}

function celebrateHighScore() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#790ECB', '#FFFFFF', '#9a3ee0'],
        ticks: 200,
        gravity: 1,
        decay: 0.94
    });
}

// Input handling
function handleInput() {
    if (gameState === 'start') {
        startGame();
    } else if (gameState === 'playing') {
        jump();
    } else if (gameState === 'gameOver') {
        restartGame();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        handleInput();
    }
});

canvas.addEventListener('click', handleInput);

// Sound toggle button event listener
const soundToggle = document.getElementById('soundToggle');
soundToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent triggering game input
    toggleSound();
});

// Game functions
function updateDifficulty() {
    const currentScore = Math.floor(score);
    
    // First threshold at 200, then every 100 points thereafter
    let nextThreshold;
    if (lastDifficultyThreshold === 0) {
        nextThreshold = 200;
    } else {
        nextThreshold = lastDifficultyThreshold + 100;
    }
    
    // Check if we've reached the next threshold
    if (currentScore >= nextThreshold) {
        difficultyMultiplier *= 1.2;
        lastDifficultyThreshold = nextThreshold;
    }
}

function getCurrentPipeSpeed() {
    return PIPE_SPEED * difficultyMultiplier;
}

function resetDifficulty() {
    difficultyMultiplier = 1.0;
    lastDifficultyThreshold = 0;
}

function startGame() {
    gameState = 'playing';
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    score = 0;
    frameCount = 0;
    pipes = [];
    player.y = canvas.height / 2;
    player.velocity = 0;
    
    // Reset difficulty on game start
    resetDifficulty();
    
    // Load high score on game initialization
    highScore = getHighScore();
    
    // Start audio playback
    updateAudio();
}

function restartGame() {
    startGame();
}

function jump() {
    player.velocity = JUMP_POWER;
}

function updatePlayer() {
    if (gameState !== 'playing') return;
    
    // Apply gravity
    player.velocity += GRAVITY;
    player.y += player.velocity;
    
    // Calculate rotation based on velocity
    player.rotation = Math.min(Math.max(player.velocity * 3, -30), 90);
    
    // Check boundaries
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        endGame();
    }
    
    if (player.y < 0) {
        player.y = 0;
        player.velocity = 0;
    }
}

function createPipe() {
    const minHeight = 50;
    const maxHeight = canvas.height - PIPE_GAP - minHeight;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
    
    pipes.push({
        x: canvas.width,
        topHeight: topHeight,
        bottomY: topHeight + PIPE_GAP
    });
}

function updatePipes() {
    if (gameState !== 'playing') return;
    
    // Spawn new pipes
    if (frameCount % PIPE_SPAWN_INTERVAL === 0) {
        createPipe();
    }
    
    // Move and remove pipes using dynamic speed
    const currentSpeed = getCurrentPipeSpeed();
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= currentSpeed;
        
        // Remove off-screen pipes
        if (pipes[i].x + PIPE_WIDTH < 0) {
            pipes.splice(i, 1);
        }
    }
}

function checkCollisions() {
    if (gameState !== 'playing') return;
    
    for (const pipe of pipes) {
        // Check if player is in pipe's x range
        if (player.x + player.width > pipe.x && player.x < pipe.x + PIPE_WIDTH) {
            // Check collision with top pipe
            if (player.y < pipe.topHeight) {
                endGame();
                return;
            }
            // Check collision with bottom pipe
            if (player.y + player.height > pipe.bottomY) {
                endGame();
                return;
            }
        }
    }
}

function updateScore() {
    if (gameState === 'playing') {
        score += 0.1;
    }
}

function endGame() {
    gameState = 'gameOver';
    
    // Pause audio playback
    updateAudio();
    
    // Save score to localStorage
    saveScore(score);
    
    // Check if this is a new high score and trigger confetti
    const wasNewHighScore = isNewHighScore(score);
    
    // Update high score if needed
    const newHighScore = getHighScore();
    
    // Trigger confetti celebration for new high score
    if (wasNewHighScore) {
        celebrateHighScore();
    }
    
    finalScoreElement.textContent = Math.floor(score);
    
    // Update high score display on game over screen
    const highScoreElement = document.getElementById('highScore');
    if (highScoreElement) {
        highScoreElement.textContent = newHighScore;
    }
    
    gameOverScreen.classList.remove('hidden');
}

function drawPlayer() {
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    ctx.rotate((player.rotation * Math.PI) / 180);
    ctx.drawImage(
        player.image,
        -player.width / 2,
        -player.height / 2,
        player.width,
        player.height
    );
    ctx.restore();
}

function drawPipes() {
    ctx.fillStyle = BRAND_COLORS.PIPE_PRIMARY;
    
    for (const pipe of pipes) {
        // Draw top pipe
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        
        // Draw bottom pipe
        ctx.fillRect(
            pipe.x,
            pipe.bottomY,
            PIPE_WIDTH,
            canvas.height - pipe.bottomY
        );
        
        // Pipe caps
        ctx.fillStyle = BRAND_COLORS.PIPE_CAP;
        ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, PIPE_WIDTH + 10, 20);
        ctx.fillRect(pipe.x - 5, pipe.bottomY, PIPE_WIDTH + 10, 20);
        ctx.fillStyle = BRAND_COLORS.PIPE_PRIMARY;
    }
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px Arial';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.strokeText(Math.floor(score), 20, 50);
    ctx.fillText(Math.floor(score), 20, 50);
}

function drawHighScore() {
    const currentHighScore = getHighScore();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '20px Arial';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeText(`High: ${currentHighScore}`, 20, 85);
    ctx.fillText(`High: ${currentHighScore}`, 20, 85);
}

function drawBackground() {
    // Sky
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Ground
    ctx.fillStyle = '#DEB887';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
}

function gameLoop() {
    // Update
    if (gameState === 'playing') {
        frameCount++;
        updatePlayer();
        updatePipes();
        checkCollisions();
        updateScore();
        updateDifficulty();
    }
    
    // Draw
    drawBackground();
    drawPipes();
    drawPlayer();
    drawScore();
    if (gameState === 'playing') {
        drawHighScore();
    }
    
    requestAnimationFrame(gameLoop);
}

// Start the game loop
highScore = getHighScore();
initAudio();
updateSoundButton();
initPlayerPosition();
gameLoop();
