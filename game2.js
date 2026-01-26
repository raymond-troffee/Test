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

// Sound Manager using Web Audio API
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.sfxGain = null;
        this.initAudio();
    }

    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            // Create gain node for volume control
            this.sfxGain = this.audioContext.createGain();
            this.sfxGain.gain.value = 0.5; // SFX volume (50%)
            this.sfxGain.connect(this.audioContext.destination);
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }

    // Generate a tone (simple sound effect)
    playTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = type;
            oscillator.frequency.value = frequency;
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.sfxGain);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (e) {
            console.warn('Error playing tone:', e);
        }
    }

    // Play correct collectible sound
    playCorrect() {
        this.playTone(523.25, 0.1, 'sine', 0.3); // C5
        setTimeout(() => this.playTone(659.25, 0.1, 'sine', 0.3), 50); // E5
    }

    // Play wrong collectible sound
    playWrong() {
        this.playTone(200, 0.2, 'sawtooth', 0.4);
        setTimeout(() => this.playTone(150, 0.2, 'sawtooth', 0.4), 100);
    }

    // Play word complete sound
    playWordComplete() {
        this.playTone(523.25, 0.1, 'sine', 0.3); // C5
        setTimeout(() => this.playTone(659.25, 0.1, 'sine', 0.3), 100); // E5
        setTimeout(() => this.playTone(783.99, 0.1, 'sine', 0.3), 200); // G5
        setTimeout(() => this.playTone(1046.50, 0.2, 'sine', 0.3), 300); // C6
    }

    // Play game over sound
    playGameOver() {
        this.playTone(200, 0.3, 'sawtooth', 0.5);
        setTimeout(() => this.playTone(150, 0.3, 'sawtooth', 0.5), 200);
        setTimeout(() => this.playTone(100, 0.4, 'sawtooth', 0.5), 400);
    }

    // Speak Chinese/Korean word using Web Speech API
    speakWord(word, isKorean = false) {
        if ('speechSynthesis' in window) {
            try {
                // Cancel any ongoing speech
                window.speechSynthesis.cancel();
                
                // Helper function to actually speak (called after voices are loaded)
                const doSpeak = () => {
                    const utterance = new SpeechSynthesisUtterance(word);
                    
                    // Set language based on isKorean flag
                    if (isKorean) {
                        utterance.lang = 'ko-KR'; // Korean
                    } else {
                        utterance.lang = 'zh-CN'; // Mandarin Chinese
                    }
                    
                    // Set voice properties
                    utterance.rate = 0.9; // Slightly slower for clarity
                    utterance.pitch = 1.0;
                    utterance.volume = 0.7;
                    
                    // Get available voices
                    const voices = window.speechSynthesis.getVoices();
                    
                    // Try to find a native voice for the language
                    let preferredVoice = null;
                    if (isKorean) {
                        // Prefer Korean voices - try exact match first, then any Korean voice
                        preferredVoice = voices.find(voice => 
                            voice.lang === 'ko-KR' || voice.lang === 'ko'
                        ) || voices.find(voice => 
                            voice.lang.startsWith('ko')
                        );
                    } else {
                        // Prefer Chinese voices - try exact match first, then any Chinese voice
                        preferredVoice = voices.find(voice => 
                            voice.lang === 'zh-CN' || voice.lang === 'zh-TW'
                        ) || voices.find(voice => 
                            voice.lang.startsWith('zh')
                        );
                    }
                    
                    if (preferredVoice) {
                        utterance.voice = preferredVoice;
                        console.log(`Using voice: ${preferredVoice.name} (${preferredVoice.lang}) for ${isKorean ? 'Korean' : 'Chinese'}`);
                    } else {
                        console.warn(`No ${isKorean ? 'Korean' : 'Chinese'} voice found, using default`);
                    }
                    
                    // Speak the word
                    window.speechSynthesis.speak(utterance);
                };
                
                // Get voices - they might not be loaded yet
                const voices = window.speechSynthesis.getVoices();
                
                // If voices are already loaded, speak immediately
                if (voices.length > 0) {
                    doSpeak();
                } else {
                    // Wait for voices to load
                    const checkVoices = () => {
                        const loadedVoices = window.speechSynthesis.getVoices();
                        if (loadedVoices.length > 0) {
                            doSpeak();
                        } else {
                            // Retry after a short delay
                            setTimeout(checkVoices, 100);
                        }
                    };
                    
                    // Some browsers need the onvoiceschanged event
                    if (window.speechSynthesis.onvoiceschanged !== undefined) {
                        const onceHandler = () => {
                            window.speechSynthesis.onvoiceschanged = null;
                            doSpeak();
                        };
                        window.speechSynthesis.onvoiceschanged = onceHandler;
                        // Also try immediately in case voices are already loaded
                        setTimeout(() => {
                            if (window.speechSynthesis.getVoices().length > 0) {
                                window.speechSynthesis.onvoiceschanged = null;
                                doSpeak();
                            }
                        }, 100);
                    } else {
                        checkVoices();
                    }
                }
            } catch (e) {
                console.warn('Error speaking word:', e);
            }
        } else {
            console.warn('Speech synthesis not supported in this browser');
        }
    }

    // Resume audio context (needed after user interaction)
    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
}

// Initialize sound manager
const soundManager = new SoundManager();

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
let health = 5; // Player health
let playerHurtTime = 0; // Track when player was hurt (for red color effect)
let animationFrameId = null; // Track animation frame ID to cancel old loops

// Player class (top-down view)
class Player {
    constructor() {
        this.width = 50;
        this.height = 50;
        this.baseColor = '#4CAF50'; // Normal green color
        this.hurtColor = '#f44336'; // Red color when hurt
        this.color = this.baseColor;
        this.speed = 5;
        // Position will be set after canvas is initialized
        this.x = 0;
        this.y = 0;
    }
    
    hurt() {
        // Set player to red color for 1 second
        this.color = this.hurtColor;
        playerHurtTime = Date.now();
    }
    
    updateColor() {
        // Check if 1 second has passed since being hurt
        if (playerHurtTime > 0 && Date.now() - playerHurtTime >= 1000) {
            this.color = this.baseColor;
            playerHurtTime = 0;
        }
    }
    
    initPosition() {
        if (canvas) {
            this.x = canvas.width / 2 - this.width / 2; // Center horizontally
            this.y = canvas.height - 80; // Near bottom
        }
    }

    update() {
        // Update color (check if hurt effect should end)
        this.updateColor();
        
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
        this.hit = false; // Track if obstacle has been hit
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
    constructor(x, part, lane = 0, isTarget = true) {
        // Lane determines horizontal position (0 = left, 1 = center, 2 = right)
        const laneWidth = canvas.width / 3;
        this.width = 80; // Increased to match larger text
        this.height = 80; // Increased to match larger text
        this.x = 50 + (lane * laneWidth) + (laneWidth / 2) - (this.width / 2);
        this.y = -80; // Start from top
        this.speed = gameSpeed;
        this.part = part;
        this.isTarget = isTarget; // true = target word part, false = distractor
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
    // CRITICAL: Cancel any existing game loop first to prevent multiple loops running
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
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
    health = 5; // Reset health to 5
    isPaused = false; // Reset pause state
    
    // CRITICAL: Reset speed and start time FIRST, before any game loop runs
    gameSpeed = 1.0; // Reset speed to 1.0
    gameStartTime = Date.now(); // Record game start time - MUST be set here for speed calculation

    // Update speed display immediately to show 1.00x
    const speedValueEl = document.getElementById('speedValue');
    if (speedValueEl) {
        speedValueEl.textContent = '1.00x';
    }

    // Create player
    player = new Player();
    player.initPosition();
    player.color = player.baseColor; // Reset to normal color
    playerHurtTime = 0; // Reset hurt timer

    // Setup touch controls
    setupTouchControls();

    // Load first word
    loadWord(0);

    // Update word review (always visible)
    updateWordReview();

    // Start game immediately (no pause)
    gameState = 'playing';
    
    // Resume audio context
    soundManager.resume();
    
    gameLoop();
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
    
    // Update word review display (always visible at bottom)
    if (document.getElementById('targetWordReview')) {
        updateWordReview();
    }
    
    // Speak the word when it's loaded (with a small delay to ensure UI is ready)
    setTimeout(() => {
        soundManager.speakWord(word.word, isKorean);
    }, 300);
    
    // Update UI
    updateUI();
}

// Get distractor parts (parts not in current word)
function getDistractorParts(currentWord) {
    const wordList = getCurrentWordList();
    const allParts = new Set();
    
    // Collect all parts from all words
    wordList.forEach(w => {
        w.parts.forEach(p => allParts.add(p));
    });
    
    // Remove current word parts to get distractors
    currentWord.parts.forEach(p => allParts.delete(p));
    
    return Array.from(allParts);
}

// Generate collectibles on the road (top-down, from top)
function generateCollectibles(word) {
    if (!canvas) {
        console.error('Canvas not initialized!');
        return;
    }
    
    const parts = [...word.parts];
    const distractorParts = getDistractorParts(word);
    
    // Find which target parts still need to be generated
    const neededParts = parts.filter(part => 
        !collectedParts.includes(part) || 
        collectedParts.filter(p => p === part).length < parts.filter(p => p === part).length
    );
    
    // Create array of all collectibles to spawn (target + distractors)
    const allCollectiblesToSpawn = [];
    
    // Add target word collectibles
    neededParts.forEach(part => {
        allCollectiblesToSpawn.push({ part: part, isTarget: true });
    });
    
    // Add distractor collectibles (wrong parts) - 1-2 distractors
    const numDistractors = Math.min(2, distractorParts.length);
    for (let i = 0; i < numDistractors; i++) {
        if (distractorParts.length > 0) {
            const randomPart = distractorParts[Math.floor(Math.random() * distractorParts.length)];
            allCollectiblesToSpawn.push({ part: randomPart, isTarget: false });
        }
    }
    
    // Shuffle the array to randomize order
    for (let i = allCollectiblesToSpawn.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allCollectiblesToSpawn[i], allCollectiblesToSpawn[j]] = [allCollectiblesToSpawn[j], allCollectiblesToSpawn[i]];
    }
    
    // Generate collectibles in random order
    allCollectiblesToSpawn.forEach((item, index) => {
        let collectible = null;
        let attempts = 0;
        const maxAttempts = 15;
        
        while (!collectible && attempts < maxAttempts) {
            const lane = Math.floor(Math.random() * 3);
            const laneWidth = canvas.width / 3;
            const x = 50 + (lane * laneWidth) + (laneWidth / 2) - 40;
            const y = -80 - (index * 250);
            
            // Check if this position would overlap with any obstacle or other collectible
            if (!wouldOverlapWithObstacles(x, y, 80, 80)) {
                collectible = new Collectible(0, item.part, lane, item.isTarget);
                collectible.y = y;
                collectibles.push(collectible);
            }
            attempts++;
        }
        
        // If we couldn't find a non-overlapping position, place it in a different lane
        if (!collectible) {
            // Try all lanes systematically
            for (let lane = 0; lane < 3; lane++) {
                const laneWidth = canvas.width / 3;
                const x = 50 + (lane * laneWidth) + (laneWidth / 2) - 40;
                const y = -80 - (index * 250);
                if (!wouldOverlapWithObstacles(x, y, 80, 80)) {
                    collectible = new Collectible(0, item.part, lane, item.isTarget);
                    collectible.y = y;
                    collectibles.push(collectible);
                    break;
                }
            }
        }
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
                
                const wordList = getCurrentWordList();
                const currentWord = wordList[currentWordIndex];
                
                // Speak the collected part (whether target or distractor)
                soundManager.speakWord(collectible.part, isKorean);
                
                // Check if this is a target word part
                if (collectible.isTarget && currentWord.parts.includes(collectible.part)) {
                    // Correct part collected
                    collectedParts.push(collectible.part);
                    score += 10;
                    soundManager.playCorrect();
                    updateUI();
                    checkWordComplete();
                } else {
                    // Wrong part collected (distractor) - reduce health
                    health--;
                    player.hurt(); // Make player red for 1 second
                    soundManager.playWrong();
                    updateUI();
                    
                    // Check if game over
                    if (health <= 0) {
                        gameOver();
                    }
                }
            }
        }
    });

    // Check obstacles
    obstacles.forEach((obstacle, index) => {
        if (!obstacle.hit) {
            const obstacleBounds = obstacle.getBounds();
            if (isColliding(playerBounds, obstacleBounds)) {
                // Mark obstacle as hit so player can pass through
                obstacle.hit = true;
                
                // Reduce health
                health--;
                player.hurt(); // Make player red for 1 second
                soundManager.playWrong(); // Play wrong sound
                updateUI();
                
                // Remove obstacle after a short delay (so player can pass through)
                setTimeout(() => {
                    const obstacleIndex = obstacles.indexOf(obstacle);
                    if (obstacleIndex > -1) {
                        obstacles.splice(obstacleIndex, 1);
                    }
                }, 100);
                
                // Check if game over
                if (health <= 0) {
                    gameOver();
                }
            }
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
            soundManager.playWordComplete();
            
            // Speak the completed word after a short delay (to not overlap with completion sound)
            setTimeout(() => {
                const wordList = getCurrentWordList();
                const completedWord = wordList[currentWordIndex];
                soundManager.speakWord(completedWord.word, isKorean);
            }, 500);
            
            updateUI();
            
            // Wait for last collectible to disappear, then show review
            waitForLastPartToDisappear();
        }
    }
}

// Wait for the last collectible to disappear before loading next word
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
        // All collectibles have disappeared, load next word
        const wordList = getCurrentWordList();
        const nextIndex = currentWordIndex + 1;
        if (nextIndex < wordList.length) {
            loadWord(nextIndex);
        } else {
            // All words completed, restart
            loadWord(0);
        }
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
    
    // Update health display
    const healthDisplay = document.getElementById('healthDisplay');
    if (healthDisplay) {
        healthDisplay.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('span');
            heart.className = 'health-heart';
            if (i < health) {
                heart.textContent = '❤️';
                heart.classList.add('filled');
            } else {
                heart.textContent = '🤍';
            }
            healthDisplay.appendChild(heart);
        }
    }
    
    // Update progress
    const wordList = getCurrentWordList();
    const currentWord = wordList[currentWordIndex];
    const progress = (collectedParts.length / currentWord.parts.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

// Check if collectible would overlap with obstacles or other collectibles
function wouldOverlapWithObstacles(x, y, width, height) {
    const collectibleBounds = { x, y, width, height };
    
    // Check obstacles
    for (const obstacle of obstacles) {
        const obstacleBounds = obstacle.getBounds();
        if (isColliding(collectibleBounds, obstacleBounds)) {
            return true;
        }
    }
    
    // Check other collectibles (avoid placing target collectibles near obstacles)
    for (const collectible of collectibles) {
        const otherBounds = collectible.getBounds();
        // Check if they're close vertically (within 100 pixels)
        if (Math.abs(collectibleBounds.y - otherBounds.y) < 100) {
            if (isColliding(collectibleBounds, otherBounds)) {
                return true;
            }
        }
    }
    
    return false;
}

// Generate obstacles and collectibles (top-down, from top)
function generateGameElements() {
    // Generate obstacles randomly in different lanes, but avoid placing near target collectibles
    if (Math.random() < 0.008 && obstacles.length < 2) {
        let obstacle = null;
        let attempts = 0;
        const maxAttempts = 20;
        
        while (!obstacle && attempts < maxAttempts) {
            const lane = Math.floor(Math.random() * 3);
            const laneWidth = canvas.width / 3;
            const x = 50 + (lane * laneWidth) + (laneWidth / 2) - 25;
            const y = -60;
            
            // Check if obstacle would be too close to any target collectible
            let tooClose = false;
            for (const collectible of collectibles) {
                if (collectible.isTarget && !collectible.collected) {
                    const collectibleBounds = collectible.getBounds();
                    // Check if obstacle and collectible are in same lane and close vertically
                    const obstacleLane = Math.floor((x - 50) / laneWidth);
                    const collectibleLane = Math.floor((collectibleBounds.x - 50) / laneWidth);
                    
                    if (obstacleLane === collectibleLane && Math.abs(y - collectibleBounds.y) < 150) {
                        tooClose = true;
                        break;
                    }
                }
            }
            
            if (!tooClose) {
                obstacle = new Obstacle(x);
                obstacle.y = y;
                obstacles.push(obstacle);
            }
            attempts++;
        }
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
            // Regenerate all collectibles (target + distractors)
            generateCollectibles(currentWord);
        }
    }

    // Remove off-screen collectibles (past bottom)
    collectibles = collectibles.filter(c => c.y < canvas.height + c.height || c.collected);
}

// Update word review display (always visible at bottom)
function updateWordReview() {
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
    
    // Show review area (always visible)
    document.getElementById('targetWordReview').style.display = 'block';
}

// Game loop
function gameLoop() {
    if (gameState !== 'playing' || isPaused) {
        if (gameState === 'playing' && isPaused) {
            // Still draw the game when paused (frozen frame)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBackground();
            player.draw();
            obstacles.forEach(obs => obs.draw());
            collectibles.forEach(collectible => collectible.draw());
        }
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    drawBackground();

    // Update and draw player (only update if not paused)
    if (!isPaused) {
        player.update();
    }
    player.draw();

    // Update and draw obstacles (only update if not paused)
    // Filter out hit obstacles that are being removed
    obstacles = obstacles.filter(obs => !obs.hit || obs.y < canvas.height + obs.height);
    obstacles.forEach(obs => {
        if (!isPaused) {
            obs.update();
        }
        // Only draw if not hit (or if hit but still on screen during removal)
        if (!obs.hit) {
            obs.draw();
        }
    });

    // Update and draw collectibles (only update if not paused)
    collectibles.forEach(collectible => {
        if (!isPaused) {
            collectible.update();
        }
        collectible.draw();
    });

    // Generate new elements (only if not paused)
    if (!isPaused) {
        generateGameElements();
        // Check collisions
        checkCollisions();
    }

    // Update distance and score (only if not paused)
    if (!isPaused) {
        distance += gameSpeed / 10;
        if (Math.floor(distance) % 10 === 0) {
            score += 1;
            updateUI();
        }

        // Automatically increase speed by 0.01 every 20 seconds
        // Only calculate if game is actually playing and gameStartTime is valid (not 0)
        if (gameState === 'playing' && gameStartTime > 0) {
            const elapsedSeconds = (Date.now() - gameStartTime) / 1000;
            const speedIncrease = Math.floor(elapsedSeconds / 20) * 0.01;
            gameSpeed = 1.0 + speedIncrease;
            
            // Update speed display
            const speedValueEl = document.getElementById('speedValue');
            if (speedValueEl) {
                speedValueEl.textContent = gameSpeed.toFixed(2) + 'x';
            }
        } else {
            // If game is not playing or gameStartTime is 0, keep speed at 1.0
            gameSpeed = 1.0;
            const speedValueEl = document.getElementById('speedValue');
            if (speedValueEl) {
                speedValueEl.textContent = '1.00x';
            }
        }
    }

    // Update speeds based on current gameSpeed
    obstacles.forEach(obs => obs.speed = gameSpeed);
    collectibles.forEach(c => c.speed = gameSpeed);

    // Continue game loop
    animationFrameId = requestAnimationFrame(gameLoop);
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
    soundManager.playGameOver();
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'flex';
    document.getElementById('finalScore').textContent = score;
    document.getElementById('wordsCompleted').textContent = wordsCompleted;
    document.getElementById('distance').textContent = Math.floor(distance);
}

// Pause/Resume functions
function pauseGame() {
    if (gameState === 'playing' && !isPaused) {
        isPaused = true;
        const pauseScreen = document.getElementById('pauseScreen');
        if (pauseScreen) {
            pauseScreen.style.display = 'flex';
        }
    }
}

function resumeGame() {
    if (gameState === 'playing' && isPaused) {
        isPaused = false;
        const pauseScreen = document.getElementById('pauseScreen');
        if (pauseScreen) {
            pauseScreen.style.display = 'none';
        }
    }
}

// Event listeners
document.addEventListener('keydown', (e) => {
    // Handle ESC key for pause/resume
    if (e.key === 'Escape' || e.key === 'Esc') {
        if (gameState === 'playing') {
            if (isPaused) {
                resumeGame();
            } else {
                pauseGame();
            }
        }
        e.preventDefault();
        return;
    }
    
    // Don't register movement keys when paused
    if (!isPaused) {
        keys[e.key] = true;
        e.preventDefault();
    }
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

// Initialize speech synthesis voices (needed for some browsers)
if ('speechSynthesis' in window) {
    // Load voices when they become available
    let voicesLoaded = false;
    const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0 && !voicesLoaded) {
            voicesLoaded = true;
            // Log available voices for debugging
            console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
            // Check for Korean and Chinese voices
            const koreanVoices = voices.filter(v => v.lang.startsWith('ko'));
            const chineseVoices = voices.filter(v => v.lang.startsWith('zh'));
            if (koreanVoices.length > 0) {
                console.log('Korean voices found:', koreanVoices.map(v => `${v.name} (${v.lang})`));
            } else {
                console.warn('No Korean voices found. Korean speech may not work properly.');
            }
            if (chineseVoices.length > 0) {
                console.log('Chinese voices found:', chineseVoices.map(v => `${v.name} (${v.lang})`));
            } else {
                console.warn('No Chinese voices found. Chinese speech may not work properly.');
            }
        }
    };
    
    // Some browsers load voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    loadVoices(); // Try to load immediately
    
    // Also try loading after a short delay (some browsers need this)
    setTimeout(loadVoices, 500);
}

// Start button
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            const startScreen = document.getElementById('startScreen');
            const gameScreen = document.getElementById('gameScreen');
            
            if (startScreen && gameScreen) {
                // Stop any existing game loop first
                if (animationFrameId !== null) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
                gameState = 'start';
                isPaused = false;
                
                // Reset game state variables (but don't set gameStartTime here - let initGame() do it)
                gameSpeed = 1.0;
                gameStartTime = 0; // Set to 0 to prevent speed calculation until initGame() sets it
                score = 0;
                distance = 0;
                wordsCompleted = 0;
                currentWordIndex = 0;
                collectedParts = [];
                obstacles = [];
                collectibles = [];
                health = 5;
                playerHurtTime = 0;
                
                // Update speed display immediately
                const speedValueEl = document.getElementById('speedValue');
                if (speedValueEl) {
                    speedValueEl.textContent = '1.00x';
                }
                
                startScreen.style.display = 'none';
                gameScreen.style.display = 'block';
                
                // Resume audio context (needed for user interaction)
                soundManager.resume();
                
                // Small delay to ensure DOM is ready and old loop stops
                setTimeout(() => {
                    initGame();
                }, 100);
            } else {
                console.error('Start screen or game screen not found!');
            }
        });
    }
    
    // Resume button (from pause screen)
    const resumeBtn = document.getElementById('resumeBtn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
            resumeGame();
        });
    }
    
    // Menu button (from pause screen)
    const menuBtnPause = document.getElementById('menuBtnPause');
    if (menuBtnPause) {
        menuBtnPause.addEventListener('click', () => {
            const startScreen = document.getElementById('startScreen');
            const gameScreen = document.getElementById('gameScreen');
            const pauseScreen = document.getElementById('pauseScreen');
            
            if (startScreen && gameScreen && pauseScreen) {
                // Stop any existing game loop first
                if (animationFrameId !== null) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
                
                pauseScreen.style.display = 'none';
                gameScreen.style.display = 'none';
                startScreen.style.display = 'block';
                gameState = 'start';
                isPaused = false;
                
                // CRITICAL: Reset speed and start time to prevent speed accumulation
                gameSpeed = 1.0;
                gameStartTime = 0;
                
                // Update speed display immediately
                const speedValueEl = document.getElementById('speedValue');
                if (speedValueEl) {
                    speedValueEl.textContent = '1.00x';
                }
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
                // Stop any existing game loop first
                if (animationFrameId !== null) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
                
                gameOverScreen.style.display = 'none';
                startScreen.style.display = 'flex';
                gameState = 'start';
                
                // Reset game state variables
                gameSpeed = 1.0;
                gameStartTime = 0;
                score = 0;
                distance = 0;
                wordsCompleted = 0;
                currentWordIndex = 0;
                collectedParts = [];
                obstacles = [];
                collectibles = [];
                health = 5;
                isPaused = false;
                playerHurtTime = 0;
                
                // Reset speed display immediately
                const speedValueEl = document.getElementById('speedValue');
                if (speedValueEl) {
                    speedValueEl.textContent = '1.00x';
                }
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

