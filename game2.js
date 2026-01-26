// Chinese words data - word and its parts (radicals/components)
const chineseWords = [
    { word: '你好', parts: ['你', '好'], meaning: 'Hello' },
    { word: '谢谢', parts: ['谢', '谢'], meaning: 'Thank you' },
    { word: '再见', parts: ['再', '见'], meaning: 'Goodbye' },
    { word: '朋友', parts: ['朋', '友'], meaning: 'Friend' },
    { word: '学习', parts: ['学', '习'], meaning: 'Study' },
    { word: '学校', parts: ['学', '校'], meaning: 'School' },
    { word: '老师', parts: ['老', '师'], meaning: 'Teacher' },
    { word: '学生', parts: ['学', '生'], meaning: 'Student' },
    { word: '家庭', parts: ['家', '庭'], meaning: 'Family' },
    { word: '中国', parts: ['中', '国'], meaning: 'China' },
    { word: '北京', parts: ['北', '京'], meaning: 'Beijing' },
    { word: '上海', parts: ['上', '海'], meaning: 'Shanghai' }
];

// Korean words data - word and its parts (syllables)
const koreanWords = [
    { word: '안녕', parts: ['안', '녕'], meaning: 'Hello' },
    { word: '감사', parts: ['감', '사'], meaning: 'Thank you' },
    { word: '안녕히', parts: ['안', '녕', '히'], meaning: 'Goodbye' },
    { word: '친구', parts: ['친', '구'], meaning: 'Friend' },
    { word: '공부', parts: ['공', '부'], meaning: 'Study' },
    { word: '학교', parts: ['학', '교'], meaning: 'School' },
    { word: '선생님', parts: ['선', '생', '님'], meaning: 'Teacher' },
    { word: '학생', parts: ['학', '생'], meaning: 'Student' },
    { word: '가족', parts: ['가', '족'], meaning: 'Family' },
    { word: '한국', parts: ['한', '국'], meaning: 'Korea' },
    { word: '서울', parts: ['서', '울'], meaning: 'Seoul' },
    { word: '부산', parts: ['부', '산'], meaning: 'Busan' }
];

// Game state
let gameState = 'start'; // 'start', 'reviewing', 'playing', 'gameover'
let isPaused = false;
let canvas, ctx;
let player;
let obstacles = [];
let collectibles = [];
let gameSpeed = 1.0; // Default speed
let gameStartTime = 0; // Track when game started for speed increase
let score = 0;
let distance = 0;
let currentWordIndex = 0;
let collectedParts = [];
let wordsCompleted = 0;
let keys = {};
let touchStartX = 0;
let touchStartY = 0;
let isKorean = false; // Language toggle: false = Mandarin, true = Korean

// Player class (top-down view)
class Player {
    constructor() {
        this.width = 50;
        this.height = 50;
        this.color = '#4CAF50';
        this.speed = 5;
        // Position will be set after canvas is initialized
        this.x = 0;
        this.y = 0;
    }
    
    initPosition() {
        if (canvas) {
            this.x = canvas.width / 2 - this.width / 2; // Center horizontally
            this.y = canvas.height - 80; // Near bottom
        }
    }

    update() {
        // Only horizontal movement (left/right)
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
            this.x = Math.max(50, this.x - this.speed);
        }
        if (keys['ArrowRight'] || keys['d'] || keys['D']) {
            this.x = Math.min(canvas.width - this.width - 50, this.x + this.speed);
        }
    }

    draw() {
        // Draw player as a circle (top-down view)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw direction indicator (arrow pointing up)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y + 10);
        ctx.lineTo(this.x + this.width / 2 - 10, this.y + 25);
        ctx.lineTo(this.x + this.width / 2 + 10, this.y + 25);
        ctx.closePath();
        ctx.fill();
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// Obstacle class (top-down view, moving from top to bottom)
class Obstacle {
    constructor(x) {
        this.x = x;
        this.y = -60; // Start from top
        this.width = 50;
        this.height = 50;
        this.speed = gameSpeed;
    }

    update() {
        this.y += this.speed; // Move down
    }

    draw() {
        // Draw as a square (top-down view)
        ctx.fillStyle = '#f44336';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Add a border for visibility
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// Collectible class (Chinese word parts, top-down view, moving from top to bottom)
class Collectible {
    constructor(x, part, lane = 0) {
        // Lane determines horizontal position (0 = left, 1 = center, 2 = right)
        const laneWidth = canvas.width / 3;
        this.width = 80; // Increased to match larger text
        this.height = 80; // Increased to match larger text
        this.x = 50 + (lane * laneWidth) + (laneWidth / 2) - (this.width / 2);
        this.y = -80; // Start from top
        this.speed = gameSpeed;
        this.part = part;
        this.collected = false;
    }

    update() {
        this.y += this.speed; // Move down
    }

    draw() {
        if (this.collected) return;

        // Draw as a circle with golden color
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw border
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw Chinese character (no rotation)
        ctx.fillStyle = '#000';
        ctx.font = 'bold 60px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.part, this.x + this.width / 2, this.y + this.height / 2);
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// Initialize game
function initGame() {
    canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('Canvas not found!');
        return;
    }
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 400;

    // Reset game state
    score = 0;
    distance = 0;
    wordsCompleted = 0;
    currentWordIndex = 0;
    collectedParts = [];
    obstacles = [];
    collectibles = [];
    gameSpeed = 1.0;
    gameStartTime = Date.now(); // Record game start time

    // Create player
    player = new Player();
    player.initPosition();

    // Setup touch controls
    setupTouchControls();

    // Load first word
    loadWord(0);

    // Show word review before starting
    showWordReview();
}

// Get current word list based on language
function getCurrentWordList() {
    return isKorean ? koreanWords : chineseWords;
}

// Load a word (Chinese or Korean)
function loadWord(index) {
    const wordList = getCurrentWordList();
    
    if (index >= wordList.length) {
        // All words completed, restart from beginning
        currentWordIndex = 0;
        loadWord(0);
        return;
    }

    currentWordIndex = index;
    const word = wordList[index];
    collectedParts = [];
    
    // Display target word on start screen (if visible)
    const targetWordEl = document.getElementById('targetWord');
    if (targetWordEl) {
        targetWordEl.textContent = word.word;
    }
    
    // Display current word on game screen
    const currentWordEl = document.getElementById('currentWord');
    if (currentWordEl) {
        currentWordEl.textContent = word.word + ' (' + word.meaning + ')';
    }
    
    // Show parts preview on start screen (if visible)
    const preview = document.getElementById('wordPartsPreview');
    if (preview) {
        preview.innerHTML = '';
        word.parts.forEach(part => {
            const span = document.createElement('span');
            span.className = 'word-part';
            span.textContent = part;
            preview.appendChild(span);
        });
    }

    // Generate collectibles for this word (only if canvas exists)
    if (canvas) {
        generateCollectibles(word);
    }
    
    // Update UI
    updateUI();
}

// Generate collectibles on the road (top-down, from top)
function generateCollectibles(word) {
    if (!canvas) {
        console.error('Canvas not initialized!');
        return;
    }
    
    collectibles = [];
    const parts = [...word.parts];
    
    // Generate collectibles in different lanes, spaced vertically
    parts.forEach((part, index) => {
        const lane = Math.floor(Math.random() * 3); // Random lane (0, 1, or 2)
        const collectible = new Collectible(0, part, lane);
        collectible.y = -40 - (index * 200); // Space them vertically
        collectibles.push(collectible);
    });
}

// Check collisions
function checkCollisions() {
    const playerBounds = player.getBounds();

    // Check collectibles
    collectibles.forEach(collectible => {
        if (!collectible.collected) {
            const collectibleBounds = collectible.getBounds();
            if (isColliding(playerBounds, collectibleBounds)) {
                collectible.collected = true;
                collectedParts.push(collectible.part);
                score += 10;
                updateUI();
                checkWordComplete();
            }
        }
    });

    // Check obstacles
    obstacles.forEach(obstacle => {
        const obstacleBounds = obstacle.getBounds();
        if (isColliding(playerBounds, obstacleBounds)) {
            gameOver();
        }
    });
}

// Check if word is complete
function checkWordComplete() {
    const wordList = getCurrentWordList();
    const currentWord = wordList[currentWordIndex];
    if (collectedParts.length >= currentWord.parts.length) {
        // Check if we have all required parts
        const wordPartsCopy = [...currentWord.parts];
        const collectedPartsCopy = [...collectedParts];
        
        // Check if all parts from the word are in collected parts
        let allPartsFound = true;
        for (const part of wordPartsCopy) {
            const index = collectedPartsCopy.indexOf(part);
            if (index === -1) {
                allPartsFound = false;
                break;
            }
            collectedPartsCopy.splice(index, 1); // Remove found part
        }
        
        if (allPartsFound) {
            // Word completed!
            wordsCompleted++;
            score += 50;
            updateUI();
            
            // Wait for last collectible to disappear, then show review
            waitForLastPartToDisappear();
        }
    }
}

// Wait for the last collectible to disappear before showing review
function waitForLastPartToDisappear() {
    // Check if there are any visible collectibles still on screen
    const visibleCollectibles = collectibles.filter(c => 
        !c.collected && c.y < canvas.height + c.height && c.y > -c.height
    );
    
    if (visibleCollectibles.length > 0) {
        // Still have visible collectibles, wait a bit and check again
        setTimeout(() => {
            waitForLastPartToDisappear();
        }, 100);
    } else {
        // All collectibles have disappeared, now show review
        pauseGameAndShowReview();
    }
}

// Collision detection
function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Update UI
function updateUI() {
    document.getElementById('score').textContent = score;
    
    // Update progress
    const wordList = getCurrentWordList();
    const currentWord = wordList[currentWordIndex];
    const progress = (collectedParts.length / currentWord.parts.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

// Check if collectible would overlap with obstacles
function wouldOverlapWithObstacles(x, y, width, height) {
    const collectibleBounds = { x, y, width, height };
    for (const obstacle of obstacles) {
        const obstacleBounds = obstacle.getBounds();
        if (isColliding(collectibleBounds, obstacleBounds)) {
            return true;
        }
    }
    return false;
}

// Generate obstacles and collectibles (top-down, from top)
function generateGameElements() {
    // Generate obstacles randomly in different lanes
    if (Math.random() < 0.01 && obstacles.length < 3) {
        const lane = Math.floor(Math.random() * 3); // Random lane
        const laneWidth = canvas.width / 3;
        const x = 50 + (lane * laneWidth) + (laneWidth / 2) - 25;
        obstacles.push(new Obstacle(x));
    }

    // Remove off-screen obstacles (past bottom)
    obstacles = obstacles.filter(obs => obs.y < canvas.height + obs.height);

    // Generate new collectibles if needed
    const activeCollectibles = collectibles.filter(c => c.y < canvas.height + c.height && !c.collected);
    if (activeCollectibles.length === 0) {
        const wordList = getCurrentWordList();
        const currentWord = wordList[currentWordIndex];
        // Only generate parts that haven't been collected yet
        const neededParts = currentWord.parts.filter(part => 
            !collectedParts.includes(part) || 
            collectedParts.filter(p => p === part).length < currentWord.parts.filter(p => p === part).length
        );
        
        if (neededParts.length > 0) {
            neededParts.forEach((part, index) => {
                // Try to find a lane that doesn't overlap with obstacles
                let collectible = null;
                let attempts = 0;
                const maxAttempts = 10;
                
                while (!collectible && attempts < maxAttempts) {
                    const lane = Math.floor(Math.random() * 3);
                    const laneWidth = canvas.width / 3;
                    const x = 50 + (lane * laneWidth) + (laneWidth / 2) - 40;
                    const y = -80 - (index * 200);
                    
                    // Check if this position would overlap with any obstacle
                    if (!wouldOverlapWithObstacles(x, y, 80, 80)) {
                        collectible = new Collectible(0, part, lane);
                        collectible.y = y;
                        collectibles.push(collectible);
                    }
                    attempts++;
                }
                
                // If we couldn't find a non-overlapping position, place it anyway
                if (!collectible) {
                    const lane = Math.floor(Math.random() * 3);
                    collectible = new Collectible(0, part, lane);
                    collectible.y = -80 - (index * 200);
                    collectibles.push(collectible);
                }
            });
        }
    }

    // Remove off-screen collectibles (past bottom)
    collectibles = collectibles.filter(c => c.y < canvas.height + c.height || c.collected);
}

// Show word review (below canvas, auto-hide after 2 seconds)
function showWordReview() {
    isPaused = true;
    gameState = 'reviewing';
    
    const wordList = getCurrentWordList();
    const word = wordList[currentWordIndex];
    
    // Update review display
    document.getElementById('reviewWordLarge').textContent = word.word;
    document.getElementById('reviewMeaningLarge').textContent = word.meaning;
    
    const reviewParts = document.getElementById('reviewPartsLarge');
    reviewParts.innerHTML = '';
    word.parts.forEach(part => {
        const span = document.createElement('span');
        span.className = 'review-part-large';
        span.textContent = part;
        reviewParts.appendChild(span);
    });
    
    // Show review area
    document.getElementById('targetWordReview').style.display = 'block';
    
    // Auto-hide after 2 seconds and continue
    setTimeout(() => {
        hideWordReview();
    }, 2000);
}

// Hide word review and continue game
function hideWordReview() {
    document.getElementById('targetWordReview').style.display = 'none';
    isPaused = false;
    
    // Check if we need to load next word (if word was just completed)
    const wordList = getCurrentWordList();
    const currentWord = wordList[currentWordIndex];
    
    // Check if current word is completed
    if (currentWord && collectedParts.length >= currentWord.parts.length) {
        // Word was completed, load next word
        const nextIndex = currentWordIndex + 1;
        if (nextIndex < wordList.length) {
            loadWord(nextIndex);
            // Show review for next word
            setTimeout(() => {
                showWordReview();
            }, 100);
        } else {
            // All words completed, restart
            loadWord(0);
            setTimeout(() => {
                showWordReview();
            }, 100);
        }
    } else {
        // Resume game (either initial start or mid-word)
        gameState = 'playing';
        if (!gameStartTime) {
            gameStartTime = Date.now();
        }
        gameLoop();
    }
}

// Pause game and show review after word completion
function pauseGameAndShowReview() {
    showWordReview();
}

// Game loop
function gameLoop() {
    if (gameState !== 'playing' || isPaused) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    drawBackground();

    // Update and draw player
    player.update();
    player.draw();

    // Update and draw obstacles
    obstacles.forEach(obs => {
        obs.update();
        obs.draw();
    });

    // Update and draw collectibles
    collectibles.forEach(collectible => {
        collectible.update();
        collectible.draw();
    });

    // Generate new elements
    generateGameElements();

    // Check collisions
    checkCollisions();

    // Update distance and score
    distance += gameSpeed / 10;
    if (Math.floor(distance) % 10 === 0) {
        score += 1;
        updateUI();
    }

    // Automatically increase speed by 0.01 every 20 seconds
    const elapsedSeconds = (Date.now() - gameStartTime) / 1000;
    const speedIncrease = Math.floor(elapsedSeconds / 20) * 0.01;
    gameSpeed = 1.0 + speedIncrease;
    
    // Update speed display
    const speedValueEl = document.getElementById('speedValue');
    if (speedValueEl) {
        speedValueEl.textContent = gameSpeed.toFixed(2) + 'x';
    }

    // Update speeds based on current gameSpeed
    obstacles.forEach(obs => obs.speed = gameSpeed);
    collectibles.forEach(c => c.speed = gameSpeed);

    // Continue game loop
    requestAnimationFrame(gameLoop);
}

// Draw background (top-down view)
function drawBackground() {
    // Road/ground (top-down view)
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw road lanes (3 lanes)
    const laneWidth = canvas.width / 3;
    ctx.strokeStyle = '#FFFF00';
    ctx.lineWidth = 3;
    
    // Left lane divider
    ctx.beginPath();
    ctx.moveTo(laneWidth, 0);
    ctx.lineTo(laneWidth, canvas.height);
    ctx.stroke();
    
    // Right lane divider
    ctx.beginPath();
    ctx.moveTo(laneWidth * 2, 0);
    ctx.lineTo(laneWidth * 2, canvas.height);
    ctx.stroke();
    
    // Road edges
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 0);
    ctx.lineTo(50, canvas.height);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(canvas.width - 50, 0);
    ctx.lineTo(canvas.width - 50, canvas.height);
    ctx.stroke();
    
    // Draw moving road markings (dashed lines moving down)
    ctx.strokeStyle = '#FFFF00';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 20]);
    const offset = (Date.now() / 10) % 40;
    for (let y = -offset; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(laneWidth, y);
        ctx.lineTo(laneWidth, y + 20);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(laneWidth * 2, y);
        ctx.lineTo(laneWidth * 2, y + 20);
        ctx.stroke();
    }
    ctx.setLineDash([]);
}

// Game over
function gameOver() {
    gameState = 'gameover';
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'flex';
    document.getElementById('finalScore').textContent = score;
    document.getElementById('wordsCompleted').textContent = wordsCompleted;
    document.getElementById('distance').textContent = Math.floor(distance);
}

// Event listeners
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    e.preventDefault();
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Touch controls
let touchControls = {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0
};

function setupTouchControls() {
    if (!canvas) return;
    
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        touchControls.startX = touch.clientX;
        touchControls.startY = touch.clientY;
    });

    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        const touch = e.changedTouches[0];
        touchControls.endX = touch.clientX;
        touchControls.endY = touch.clientY;
        
        const deltaX = touchControls.endX - touchControls.startX;
        const deltaY = touchControls.endY - touchControls.startY;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > 30) {
                keys['ArrowRight'] = true;
                setTimeout(() => keys['ArrowRight'] = false, 100);
            } else if (deltaX < -30) {
                keys['ArrowLeft'] = true;
                setTimeout(() => keys['ArrowLeft'] = false, 100);
            }
        } else {
            // Vertical swipe (not used in top-down, but keep for compatibility)
            // Left/right swipes are handled above
        }
    });
}

// Start button
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            const startScreen = document.getElementById('startScreen');
            const gameScreen = document.getElementById('gameScreen');
            
            if (startScreen && gameScreen) {
                startScreen.style.display = 'none';
                gameScreen.style.display = 'block';
                gameState = 'playing';
                
                // Small delay to ensure DOM is ready
                setTimeout(() => {
                    initGame();
                }, 100);
            } else {
                console.error('Start screen or game screen not found!');
            }
        });
    } else {
        console.error('Start button not found!');
    }
    
    // Restart button
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            const gameOverScreen = document.getElementById('gameOverScreen');
            const startScreen = document.getElementById('startScreen');
            
            if (gameOverScreen && startScreen) {
                gameOverScreen.style.display = 'none';
                startScreen.style.display = 'flex';
                gameState = 'start';
            }
        });
    }
    
    // Menu button
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    // Speed display (auto-updates in game loop)
    const speedValue = document.getElementById('speedValue');
    if (speedValue) {
        speedValue.textContent = '1.0x';
    }
    
    // Language toggle
    const languageToggle = document.getElementById('languageToggle');
    const toggleLabel = document.getElementById('toggleLabel');
    if (languageToggle && toggleLabel) {
        languageToggle.addEventListener('change', (e) => {
            isKorean = e.target.checked;
            toggleLabel.textContent = isKorean ? 'Korean' : 'Mandarin';
            
            // Reload current word with new language
            if (gameState === 'playing') {
                currentWordIndex = 0;
                collectedParts = [];
                loadWord(0);
            } else {
                // Update preview on start screen
                const wordList = getCurrentWordList();
                if (wordList.length > 0) {
                    const word = wordList[0];
                    const targetWordEl = document.getElementById('targetWord');
                    const preview = document.getElementById('wordPartsPreview');
                    
                    if (targetWordEl) {
                        targetWordEl.textContent = word.word;
                    }
                    
                    if (preview) {
                        preview.innerHTML = '';
                        word.parts.forEach(part => {
                            const span = document.createElement('span');
                            span.className = 'word-part';
                            span.textContent = part;
                            preview.appendChild(span);
                        });
                    }
                }
            }
        });
    }
    
    // Load first word for preview on start screen
    const wordList = getCurrentWordList();
    if (wordList.length > 0) {
        const word = wordList[0];
        const targetWordEl = document.getElementById('targetWord');
        const preview = document.getElementById('wordPartsPreview');
        
        if (targetWordEl) {
            targetWordEl.textContent = word.word;
        }
        
        if (preview) {
            preview.innerHTML = '';
            word.parts.forEach(part => {
                const span = document.createElement('span');
                span.className = 'word-part';
                span.textContent = part;
                preview.appendChild(span);
            });
        }
    }
});

