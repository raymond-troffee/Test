// Safari animals data - emoji and Malay name pairs
const animals = [
    { emoji: '🦒', name: 'Zirafah' },
    { emoji: '🦁', name: 'Singa' },
    { emoji: '🐘', name: 'Gajah' },
    { emoji: '🦓', name: 'Kuda Belang' },
    { emoji: '🦏', name: 'Badak' },
    { emoji: '🐆', name: 'Harimau Bintang' },
    { emoji: '🦛', name: 'Kuda Nil' },
    { emoji: '🐊', name: 'Buaya' },
    { emoji: '🦘', name: 'Kanggaru' },
    { emoji: '🐨', name: 'Koala' }
];

// Game state
let currentLevel = 1;
let lives = 3;
let score = 0;
let selectedCards = [];
let matchedPairs = 0;
let currentAnimals = [];
let cards = [];
let isChecking = false;

// Initialize game
function initGame() {
    currentLevel = 1;
    lives = 3;
    score = 0;
    updateUI();
    startLevel();
}

// Start a new level
function startLevel() {
    selectedCards = [];
    matchedPairs = 0;
    
    // Select animals for this level (3 animals per level)
    const animalsPerLevel = 3;
    const shuffled = [...animals].sort(() => Math.random() - 0.5);
    currentAnimals = shuffled.slice(0, animalsPerLevel);
    
    // Create cards array with both emojis and names
    cards = [];
    currentAnimals.forEach(animal => {
        cards.push({ type: 'emoji', value: animal.emoji, match: animal.name, matched: false });
        cards.push({ type: 'name', value: animal.name, match: animal.emoji, matched: false });
    });
    
    // Shuffle cards
    cards = cards.sort(() => Math.random() - 0.5);
    
    // Update instruction
    document.getElementById('instructionText').textContent = 
        `Padankan ${animalsPerLevel} haiwan dengan gambar mereka`;
    
    renderCards();
}

// Render cards on the game board
function renderCards() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'game-card';
        cardElement.dataset.index = index;
        
        if (card.matched) {
            cardElement.classList.add('matched');
        }
        
        if (card.type === 'emoji') {
            cardElement.classList.add('emoji-card');
            cardElement.textContent = card.value;
        } else {
            cardElement.classList.add('name-card');
            cardElement.textContent = card.value;
        }
        
        cardElement.addEventListener('click', () => selectCard(index));
        gameBoard.appendChild(cardElement);
    });
}

// Handle card selection
function selectCard(index) {
    const card = cards[index];
    
    // Don't allow selecting during check or if already matched/selected
    if (isChecking || card.matched || selectedCards.includes(index)) {
        return;
    }
    
    // Don't allow selecting more than 2 cards
    if (selectedCards.length >= 2) {
        return;
    }
    
    // Add to selected cards
    selectedCards.push(index);
    const cardElement = document.querySelector(`[data-index="${index}"]`);
    cardElement.classList.add('selected');
    
    // If 2 cards are selected, check for match
    if (selectedCards.length === 2) {
        isChecking = true;
        setTimeout(checkMatch, 800);
    }
}

// Check if selected cards match
function checkMatch() {
    const [index1, index2] = selectedCards;
    const card1 = cards[index1];
    const card2 = cards[index2];
    const cardElement1 = document.querySelector(`[data-index="${index1}"]`);
    const cardElement2 = document.querySelector(`[data-index="${index2}"]`);
    
    // Check if they're different types and match
    if (card1.type !== card2.type && 
        ((card1.type === 'emoji' && card1.match === card2.value) ||
         (card1.type === 'name' && card1.match === card2.value))) {
        // Match found!
        cards[index1].matched = true;
        cards[index2].matched = true;
        matchedPairs++;
        
        // Add matched class
        cardElement1.classList.add('matched');
        cardElement2.classList.add('matched');
        
        // Update score
        score += 10;
        updateUI();
        
        // Clear selection
        selectedCards = [];
        isChecking = false;
        
        // Check if level is complete
        if (matchedPairs === currentAnimals.length) {
            setTimeout(() => {
                currentLevel++;
                if (currentLevel <= 10) {
                    startLevel();
                } else {
                    endGame(true);
                }
            }, 1000);
        }
    } else {
        // No match - lose a life
        lives--;
        updateUI();
        
        // Show wrong match briefly, then remove selection
        cardElement1.classList.add('wrong-match');
        cardElement2.classList.add('wrong-match');
        
        setTimeout(() => {
            cardElement1.classList.remove('selected', 'wrong-match');
            cardElement2.classList.remove('selected', 'wrong-match');
            
            // Clear selection
            selectedCards = [];
            isChecking = false;
            
            // Check if game over
            if (lives <= 0) {
                setTimeout(() => endGame(false), 500);
            }
        }, 1000);
    }
}

// Update UI elements
function updateUI() {
    // Update level
    document.getElementById('currentLevel').textContent = currentLevel;
    
    // Update hearts
    const heartsContainer = document.getElementById('hearts');
    heartsContainer.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const heart = document.createElement('span');
        heart.className = 'heart';
        if (i < lives) {
            heart.textContent = '❤️';
            heart.classList.add('filled');
        } else {
            heart.textContent = '🤍';
        }
        heartsContainer.appendChild(heart);
    }
}

// End game
function endGame(won) {
    const gameBoard = document.getElementById('gameBoard');
    if (won) {
        gameBoard.innerHTML = `
            <div class="game-over">
                <h2>🎉 Tahniah! 🎉</h2>
                <p>Anda telah menamatkan semua peringkat!</p>
                <p>Skor: ${score}</p>
                <button onclick="initGame()" class="restart-btn">Main Lagi</button>
            </div>
        `;
    } else {
        gameBoard.innerHTML = `
            <div class="game-over">
                <h2>😢 Permainan Tamat</h2>
                <p>Anda telah kehabisan nyawa!</p>
                <p>Skor: ${score}</p>
                <p>Peringkat: ${currentLevel - 1}</p>
                <button onclick="initGame()" class="restart-btn">Main Lagi</button>
            </div>
        `;
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    initGame();
});
