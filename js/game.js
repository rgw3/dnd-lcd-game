// ===================================
// Game State and Configuration
// ===================================

class DnDGame {
    constructor() {
        // Grid configuration
        this.gridSize = 10; // 10x10 grid
        this.rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        
        // Player state
        this.player = {
            x: 0,
            y: 0,
            hasArrow: false,
            hasRope: false
        };
        
        // Game state
        this.gameActive = false;
        this.score = 0;
        this.startTime = null;
        this.timerInterval = null;
        
        // Entity positions (will populate these later)
        this.dragon = { x: -1, y: -1, alive: true };
        this.arrow = { x: -1, y: -1, collected: false };
        this.rope = { x: -1, y: -1, collected: false };
        this.pits = [];
        this.bats = [];
        
        // Initialize DOM elements
        this.initializeElements();
        
        // Bind event listeners
        this.bindEvents();
        
        // Start a new game
        this.newGame();
    }
    
    // ===================================
    // Initialization
    // ===================================
    
    initializeElements() {
        // Display elements
        this.positionDisplay = document.getElementById('position-display');
        this.scoreDisplay = document.getElementById('score');
        this.timeDisplay = document.getElementById('time');
        this.hasArrowDisplay = document.getElementById('has-arrow');
        this.hasRopeDisplay = document.getElementById('has-rope');
        this.messageDisplay = document.getElementById('message-display');
        
        // Direction indicators
        this.northIndicator = document.getElementById('north-indicator');
        this.eastIndicator = document.getElementById('east-indicator');
        this.southIndicator = document.getElementById('south-indicator');
        this.westIndicator = document.getElementById('west-indicator');
        
        // Buttons
        this.btnNorth = document.getElementById('btn-north');
        this.btnEast = document.getElementById('btn-east');
        this.btnSouth = document.getElementById('btn-south');
        this.btnWest = document.getElementById('btn-west');
        this.btnShoot = document.getElementById('btn-shoot');
        this.btnNewGame = document.getElementById('btn-new-game');
    }
    
    bindEvents() {
        // Movement buttons
        this.btnNorth.addEventListener('click', () => this.movePlayer('north'));
        this.btnEast.addEventListener('click', () => this.movePlayer('east'));
        this.btnSouth.addEventListener('click', () => this.movePlayer('south'));
        this.btnWest.addEventListener('click', () => this.movePlayer('west'));
        
        // Action buttons
        this.btnShoot.addEventListener('click', () => this.shootArrow());
        this.btnNewGame.addEventListener('click', () => this.newGame());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }
    
    handleKeyPress(e) {
        if (!this.gameActive) return;
        
        switch(e.key.toLowerCase()) {
            case 'w':
            case 'arrowup':
                this.movePlayer('north');
                break;
            case 'd':
            case 'arrowright':
                this.movePlayer('east');
                break;
            case 's':
            case 'arrowdown':
                this.movePlayer('south');
                break;
            case 'a':
            case 'arrowleft':
                this.movePlayer('west');
                break;
            case ' ':
            case 'enter':
                this.shootArrow();
                break;
        }
    }
    
    // ===================================
    // Game Logic
    // ===================================
    
    newGame() {
        // Reset player position
        this.player.x = 0;
        this.player.y = 0;
        this.player.hasArrow = false;
        this.player.hasRope = false;
        
        // Reset game state
        this.score = 0;
        this.gameActive = true;
        this.startTime = Date.now();
        
        // Place entities randomly (we'll implement this properly in next phase)
        this.placeEntities();
        
        // Start timer
        this.startTimer();
        
        // Update display
        this.updateDisplay();
        this.showMessage('Find the magical arrow, then slay the dragon!');
    }
    
    placeEntities() {
        // For now, just place them randomly
        // We'll make this smarter in the next phase
        
        // Dragon - random position (not at player start)
        do {
            this.dragon.x = Math.floor(Math.random() * this.gridSize);
            this.dragon.y = Math.floor(Math.random() * this.gridSize);
        } while (this.dragon.x === 0 && this.dragon.y === 0);
        this.dragon.alive = true;
        
        // Arrow - random position (not at player start or dragon)
        do {
            this.arrow.x = Math.floor(Math.random() * this.gridSize);
            this.arrow.y = Math.floor(Math.random() * this.gridSize);
        } while ((this.arrow.x === 0 && this.arrow.y === 0) || 
                 (this.arrow.x === this.dragon.x && this.arrow.y === this.dragon.y));
        this.arrow.collected = false;
        
        // Rope - random position (we'll make this difficulty-dependent later)
        do {
            this.rope.x = Math.floor(Math.random() * this.gridSize);
            this.rope.y = Math.floor(Math.random() * this.gridSize);
        } while ((this.rope.x === 0 && this.rope.y === 0) || 
                 (this.rope.x === this.dragon.x && this.rope.y === this.dragon.y) ||
                 (this.rope.x === this.arrow.x && this.rope.y === this.arrow.y));
        this.rope.collected = false;
        
        // Pits and bats - will add in later phases
        this.pits = [];
        this.bats = [];
    }
    
    movePlayer(direction) {
        if (!this.gameActive) return;
        
        const oldX = this.player.x;
        const oldY = this.player.y;
        
        // Move player with wrap-around (10x10 grid wraps to opposite side)
        switch(direction) {
            case 'north':
                this.player.y = (this.player.y - 1 + this.gridSize) % this.gridSize;
                break;
            case 'east':
                this.player.x = (this.player.x + 1) % this.gridSize;
                break;
            case 'south':
                this.player.y = (this.player.y + 1) % this.gridSize;
                break;
            case 'west':
                this.player.x = (this.player.x - 1 + this.gridSize) % this.gridSize;
                break;
        }
        
        // Check what's at the new position
        this.checkPosition();
        
        // Update display
        this.updateDisplay();
    }
    
    checkPosition() {
        const px = this.player.x;
        const py = this.player.y;
        
        // Check for arrow pickup
        if (!this.arrow.collected && px === this.arrow.x && py === this.arrow.y) {
            this.player.hasArrow = true;
            this.arrow.collected = true;
            this.showMessage('You found the magical arrow!');
        }
        
        // Check for rope pickup
        if (!this.rope.collected && px === this.rope.x && py === this.rope.y) {
            this.player.hasRope = true;
            this.rope.collected = true;
            this.showMessage('You found a rope!');
        }
        
        // Check for dragon (game over if you walk into it)
        if (this.dragon.alive && px === this.dragon.x && py === this.dragon.y) {
            this.gameOver('The dragon devoured you! Game Over!');
        }
        
        // Check proximity to dragon
        this.checkProximity();
    }
    
    checkProximity() {
        // Clear all indicators first
        this.clearDirectionIndicators();
        
        const px = this.player.x;
        const py = this.player.y;
        
        // Check if dragon is adjacent (with wrap-around)
        if (this.dragon.alive) {
            // North
            if (this.isAdjacent(px, py, 'north', this.dragon.x, this.dragon.y)) {
                this.northIndicator.classList.add('active');
                this.showMessage('You hear a dragon roar from the North!');
            }
            // East
            if (this.isAdjacent(px, py, 'east', this.dragon.x, this.dragon.y)) {
                this.eastIndicator.classList.add('active');
                this.showMessage('You hear a dragon roar from the East!');
            }
            // South
            if (this.isAdjacent(px, py, 'south', this.dragon.x, this.dragon.y)) {
                this.southIndicator.classList.add('active');
                this.showMessage('You hear a dragon roar from the South!');
            }
            // West
            if (this.isAdjacent(px, py, 'west', this.dragon.x, this.dragon.y)) {
                this.westIndicator.classList.add('active');
                this.showMessage('You hear a dragon roar from the West!');
            }
        }
    }
    
    isAdjacent(px, py, direction, targetX, targetY) {
        // Check if target is in the given direction with wrap-around
        switch(direction) {
            case 'north':
                return targetX === px && targetY === (py - 1 + this.gridSize) % this.gridSize;
            case 'east':
                return targetX === (px + 1) % this.gridSize && targetY === py;
            case 'south':
                return targetX === px && targetY === (py + 1) % this.gridSize;
            case 'west':
                return targetX === (px - 1 + this.gridSize) % this.gridSize && targetY === py;
            default:
                return false;
        }
    }
    
    shootArrow() {
        if (!this.gameActive) return;
        
        if (!this.player.hasArrow) {
            this.showMessage('You need to find the magical arrow first!');
            return;
        }
        
        // For now, just a placeholder - we'll implement shooting logic in next phase
        this.showMessage('Shooting mechanic coming in Phase 3!');
    }
    
    // ===================================
    // Display Updates
    // ===================================
    
    updateDisplay() {
        // Update position display (A0-J9 format)
        const coordinate = this.getCoordinate(this.player.x, this.player.y);
        this.positionDisplay.textContent = coordinate;
        
        // Update status bar
        this.scoreDisplay.textContent = this.score;
        this.hasArrowDisplay.textContent = this.player.hasArrow ? 'Yes' : 'No';
        this.hasRopeDisplay.textContent = this.player.hasRope ? 'Yes' : 'No';
    }
    
    getCoordinate(x, y) {
        // Convert x,y to letter-number format (A0-J9)
        return this.rows[y] + x;
    }
    
    clearDirectionIndicators() {
        this.northIndicator.classList.remove('active');
        this.eastIndicator.classList.remove('active');
        this.southIndicator.classList.remove('active');
        this.westIndicator.classList.remove('active');
    }
    
    showMessage(message) {
        this.messageDisplay.textContent = message;
    }
    
    // ===================================
    // Timer
    // ===================================
    
    startTimer() {
        // Clear any existing timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Update timer every second
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            this.timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
    
    // ===================================
    // Game Over / Win
    // ===================================
    
    gameOver(message) {
        this.gameActive = false;
        clearInterval(this.timerInterval);
        this.showMessage(message);
    }
    
    win() {
        this.gameActive = false;
        clearInterval(this.timerInterval);
        
        // Calculate score (1 point per 5 seconds)
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        this.score = Math.floor(elapsed / 5);
        this.scoreDisplay.textContent = this.score;
        
        this.showMessage(`Victory! You slayed the dragon! Score: ${this.score}`);
    }
}

// ===================================
// Initialize Game
// ===================================

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new DnDGame();
});