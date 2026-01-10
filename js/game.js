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
        this.shootingMode = false;
        
        // Entity positions
        this.dragon = { x: -1, y: -1, alive: true };
        this.arrow = { x: -1, y: -1, collected: false, inFlight: false };
        this.rope = { x: -1, y: -1, collected: false };
        this.pits = []; // Array of {x, y} positions
        this.bats = []; // Will add in Phase 5
        
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
        // Movement buttons - dual purpose: move or shoot direction
        this.btnNorth.addEventListener('click', () => this.handleDirectionButton('north'));
        this.btnEast.addEventListener('click', () => this.handleDirectionButton('east'));
        this.btnSouth.addEventListener('click', () => this.handleDirectionButton('south'));
        this.btnWest.addEventListener('click', () => this.handleDirectionButton('west'));
        
        // Action buttons
        this.btnShoot.addEventListener('click', () => this.initiateShoot());
        this.btnNewGame.addEventListener('click', () => this.newGame());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }
    
    handleKeyPress(e) {
        if (!this.gameActive) return;
        
        // Prevent default for arrow keys
        if (e.key.startsWith('Arrow')) {
            e.preventDefault();
        }
        
        switch(e.key.toLowerCase()) {
            case 'w':
            case 'arrowup':
                this.handleDirectionButton('north');
                break;
            case 'd':
            case 'arrowright':
                this.handleDirectionButton('east');
                break;
            case 's':
            case 'arrowdown':
                this.handleDirectionButton('south');
                break;
            case 'a':
            case 'arrowleft':
                this.handleDirectionButton('west');
                break;
            case ' ':
            case 'enter':
                this.initiateShoot();
                break;
            case 'escape':
                // Cancel shooting mode
                if (this.shootingMode) {
                    this.cancelShoot();
                }
                break;
        }
    }
    
    handleDirectionButton(direction) {
        if (this.shootingMode) {
            // We're in shooting mode - this selects direction to shoot
            this.shootArrow(direction);
        } else {
            // Normal movement
            this.movePlayer(direction);
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
        this.shootingMode = false;
        
        // Place entities randomly
        this.placeEntities();
        
        // Start timer
        this.startTimer();
        
        // Update display
        this.updateDisplay();
        this.updateButtonStates();
        this.showMessage('Find the magical arrow, then slay the dragon!');
    }
    
    placeEntities() {
        const occupiedPositions = new Set();
        occupiedPositions.add('0,0'); // Player start position
        
        // Helper function to get random unoccupied position
        const getRandomPosition = () => {
            let x, y;
            do {
                x = Math.floor(Math.random() * this.gridSize);
                y = Math.floor(Math.random() * this.gridSize);
            } while (occupiedPositions.has(`${x},${y}`));
            occupiedPositions.add(`${x},${y}`);
            return { x, y };
        };
        
        // Dragon
        const dragonPos = getRandomPosition();
        this.dragon.x = dragonPos.x;
        this.dragon.y = dragonPos.y;
        this.dragon.alive = true;
        
        // Arrow
        const arrowPos = getRandomPosition();
        this.arrow.x = arrowPos.x;
        this.arrow.y = arrowPos.y;
        this.arrow.collected = false;
        this.arrow.inFlight = false;
        
        // Rope
        const ropePos = getRandomPosition();
        this.rope.x = ropePos.x;
        this.rope.y = ropePos.y;
        this.rope.collected = false;
        
        // Pits - 12 pits as per original game
        this.pits = [];
        for (let i = 0; i < 12; i++) {
            const pitPos = getRandomPosition();
            this.pits.push({ x: pitPos.x, y: pitPos.y });
        }
        
        console.log(`Entities placed - Dragon: ${this.getCoordinate(this.dragon.x, this.dragon.y)}, Arrow: ${this.getCoordinate(this.arrow.x, this.arrow.y)}, Rope: ${this.getCoordinate(this.rope.x, this.rope.y)}`);
        console.log(`Pits at:`, this.pits.map(p => this.getCoordinate(p.x, p.y)).join(', '));
        
        // Bats - will add in Phase 5
        this.bats = [];
    }
    
    movePlayer(direction) {
        if (!this.gameActive || this.shootingMode) return;
        
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
        
        // Check for pit FIRST (highest priority danger)
        if (this.isPitAt(px, py)) {
            if (this.player.hasRope) {
                this.showMessage('⚠️ You fell in a pit! Your rope saved you!');
            } else {
                this.gameOver('💀 You fell into a pit and died! Game Over!');
                return;
            }
        }
        
        // Check for arrow pickup
        if (!this.arrow.collected && !this.arrow.inFlight && px === this.arrow.x && py === this.arrow.y) {
            this.player.hasArrow = true;
            this.arrow.collected = true;
            this.showMessage('You found the magical arrow!');
        }
        
        // Check for arrow retrieval (after shooting and missing)
        if (this.arrow.inFlight && px === this.arrow.x && py === this.arrow.y) {
            this.player.hasArrow = true;
            this.arrow.inFlight = false;
            this.arrow.collected = true;
            this.showMessage('You retrieved your arrow!');
        }
        
        // Check for rope pickup
        if (!this.rope.collected && px === this.rope.x && py === this.rope.y) {
            this.player.hasRope = true;
            this.rope.collected = true;
            this.showMessage('You found a rope! It will save you from pits!');
        }
        
        // Check for dragon (game over if you walk into it)
        if (this.dragon.alive && px === this.dragon.x && py === this.dragon.y) {
            this.gameOver('🐉 The dragon devoured you! Game Over!');
            return;
        }
        
        // Check proximity to dangers
        this.checkProximity();
    }
    
    isPitAt(x, y) {
        return this.pits.some(pit => pit.x === x && pit.y === y);
    }
    
    checkProximity() {
        // Clear all indicators first
        this.clearDirectionIndicators();
        
        const px = this.player.x;
        const py = this.player.y;
        
        let warnings = [];
        
        // Check if dragon is adjacent (with wrap-around)
        if (this.dragon.alive) {
            const dragonDirections = [];
            
            if (this.isAdjacent(px, py, 'north', this.dragon.x, this.dragon.y)) {
                this.northIndicator.classList.add('active');
                dragonDirections.push('North');
            }
            if (this.isAdjacent(px, py, 'east', this.dragon.x, this.dragon.y)) {
                this.eastIndicator.classList.add('active');
                dragonDirections.push('East');
            }
            if (this.isAdjacent(px, py, 'south', this.dragon.x, this.dragon.y)) {
                this.southIndicator.classList.add('active');
                dragonDirections.push('South');
            }
            if (this.isAdjacent(px, py, 'west', this.dragon.x, this.dragon.y)) {
                this.westIndicator.classList.add('active');
                dragonDirections.push('West');
            }
            
            if (dragonDirections.length > 0) {
                warnings.push('🐉 DRAGON roars nearby!');
            }
        }
        
        // Check if pit is adjacent
        const pitDirections = [];
        for (const pit of this.pits) {
            if (this.isAdjacent(px, py, 'north', pit.x, pit.y)) {
                if (!pitDirections.includes('North')) pitDirections.push('North');
            }
            if (this.isAdjacent(px, py, 'east', pit.x, pit.y)) {
                if (!pitDirections.includes('East')) pitDirections.push('East');
            }
            if (this.isAdjacent(px, py, 'south', pit.x, pit.y)) {
                if (!pitDirections.includes('South')) pitDirections.push('South');
            }
            if (this.isAdjacent(px, py, 'west', pit.x, pit.y)) {
                if (!pitDirections.includes('West')) pitDirections.push('West');
            }
        }
        
        if (pitDirections.length > 0) {
            warnings.push(`⚠️ You feel a breeze... pit nearby!`);
        }
        
        // Display combined warnings
        if (warnings.length > 0) {
            this.showMessage(warnings.join(' | '));
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
    
    // ===================================
    // Shooting Mechanics
    // ===================================
    
    initiateShoot() {
        if (!this.gameActive) return;
        
        if (!this.player.hasArrow) {
            this.showMessage('You need to find the magical arrow first!');
            return;
        }
        
        // Enter shooting mode
        this.shootingMode = true;
        this.showMessage('🏹 Select a direction to shoot! (or ESC to cancel)');
        this.updateButtonStates();
    }
    
    cancelShoot() {
        this.shootingMode = false;
        this.showMessage('Shooting cancelled.');
        this.updateButtonStates();
    }
    
    shootArrow(direction) {
        if (!this.gameActive || !this.shootingMode) return;
        
        // Exit shooting mode
        this.shootingMode = false;
        
        // Player no longer has arrow
        this.player.hasArrow = false;
        
        // Calculate where arrow lands based on direction
        const arrowPath = this.calculateArrowPath(direction);
        
        // Check if dragon is in the path
        if (this.isDragonInPath(arrowPath)) {
            // HIT! Player wins!
            this.dragon.alive = false;
            this.win();
        } else {
            // MISS! Arrow lands at end of path
            const landingSpot = arrowPath[arrowPath.length - 1];
            this.arrow.x = landingSpot.x;
            this.arrow.y = landingSpot.y;
            this.arrow.inFlight = true;
            this.arrow.collected = false;
            
            const coordinate = this.getCoordinate(this.arrow.x, this.arrow.y);
            this.showMessage(`💨 Your arrow missed! It landed at ${coordinate}. Go retrieve it!`);
            
            // Reposition dragon to a new random location
            this.repositionDragon();
        }
        
        // Update display
        this.updateDisplay();
        this.updateButtonStates();
    }
    
    calculateArrowPath(direction) {
        const path = [];
        let x = this.player.x;
        let y = this.player.y;
        
        // Arrow travels in direction until it wraps around back to starting row/column
        for (let i = 0; i < this.gridSize; i++) {
            switch(direction) {
                case 'north':
                    y = (y - 1 + this.gridSize) % this.gridSize;
                    break;
                case 'east':
                    x = (x + 1) % this.gridSize;
                    break;
                case 'south':
                    y = (y + 1) % this.gridSize;
                    break;
                case 'west':
                    x = (x - 1 + this.gridSize) % this.gridSize;
                    break;
            }
            path.push({ x, y });
        }
        
        return path;
    }
    
    isDragonInPath(path) {
        return path.some(pos => pos.x === this.dragon.x && pos.y === this.dragon.y);
    }
    
    repositionDragon() {
        // Move dragon to new random position (not at player, not at arrow, not at any pit)
        let newX, newY;
        do {
            newX = Math.floor(Math.random() * this.gridSize);
            newY = Math.floor(Math.random() * this.gridSize);
        } while ((newX === this.player.x && newY === this.player.y) ||
                 (newX === this.arrow.x && newY === this.arrow.y) ||
                 this.isPitAt(newX, newY));
        
        this.dragon.x = newX;
        this.dragon.y = newY;
        
        console.log(`Dragon repositioned to ${this.getCoordinate(this.dragon.x, this.dragon.y)}`);
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
    
    updateButtonStates() {
        if (this.shootingMode) {
            // In shooting mode - highlight direction buttons
            this.btnNorth.style.backgroundColor = '#004400';
            this.btnEast.style.backgroundColor = '#004400';
            this.btnSouth.style.backgroundColor = '#004400';
            this.btnWest.style.backgroundColor = '#004400';
            this.btnShoot.textContent = 'CANCEL';
            this.btnShoot.style.backgroundColor = '#440000';
        } else {
            // Normal mode
            this.btnNorth.style.backgroundColor = '';
            this.btnEast.style.backgroundColor = '';
            this.btnSouth.style.backgroundColor = '';
            this.btnWest.style.backgroundColor = '';
            this.btnShoot.textContent = 'SHOOT';
            this.btnShoot.style.backgroundColor = '';
        }
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
        this.clearDirectionIndicators();
    }
    
    win() {
        this.gameActive = false;
        clearInterval(this.timerInterval);
        
        // Calculate score (1 point per 5 seconds)
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        this.score = Math.floor(elapsed / 5);
        this.scoreDisplay.textContent = this.score;
        
        this.clearDirectionIndicators();
        this.showMessage(`🎉 VICTORY! You slayed the dragon! Score: ${this.score} 🎉`);
    }
}

// ===================================
// Initialize Game
// ===================================

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new DnDGame();
});