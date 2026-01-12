// ===================================
// Audio Manager - Web Audio API
// ===================================

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.musicInterval = null;
        this.isMuted = false;
        this.initialized = false;
    }
    
    initialize() {
        if (this.initialized) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = 0.3;
            this.initialized = true;
            console.log('Audio initialized');
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }
    
    playTone(frequency, duration, type = 'square') {
        if (!this.initialized || this.isMuted) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playMovement() {
        this.playTone(200, 0.05, 'square');
    }
    
    playDragonRoar() {
        if (!this.initialized || this.isMuted) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }
    
    playArrowShot() {
        if (!this.initialized || this.isMuted) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }
    
    playPitFall() {
        if (!this.initialized || this.isMuted) return;
        
        const osc1 = this.audioContext.createOscillator();
        const gain1 = this.audioContext.createGain();
        
        osc1.connect(gain1);
        gain1.connect(this.masterGain);
        
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(800, this.audioContext.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.5);
        
        gain1.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        osc1.start(this.audioContext.currentTime);
        osc1.stop(this.audioContext.currentTime + 0.5);
        
        setTimeout(() => {
            this.playTone(100, 0.3, 'square');
            setTimeout(() => this.playTone(90, 0.3, 'square'), 300);
            setTimeout(() => this.playTone(80, 0.5, 'square'), 600);
        }, 500);
    }
    
    playBatFlap() {
        if (!this.initialized || this.isMuted) return;
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.playTone(300 + (i * 50), 0.08, 'square');
            }, i * 100);
        }
    }
    
    playItemPickup() {
        if (!this.initialized || this.isMuted) return;
        
        this.playTone(600, 0.1, 'sine');
        setTimeout(() => this.playTone(800, 0.15, 'sine'), 100);
    }
    
    playBatWingsWarning() {
        if (!this.initialized || this.isMuted) return;
        
        // Subtle flapping sound - quieter than actual bat encounter
        for (let i = 0; i < 2; i++) {
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.masterGain);
                
                oscillator.type = 'square';
                oscillator.frequency.value = 250 + (i * 30);
                
                gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.06);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.06);
            }, i * 80);
        }
    }
    
    playPitBreezeWarning() {
        if (!this.initialized || this.isMuted) return;
        
        // Wind/breeze sound - low frequency whoosh
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(80, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(60, this.audioContext.currentTime + 0.4);
        
        filter.type = 'lowpass';
        filter.frequency.value = 200;
        filter.Q.value = 1;
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.4);
    }
    
    playVictory() {
        if (!this.initialized || this.isMuted) return;
        
        const notes = [523, 587, 659, 784];
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.3, 'sine'), i * 200);
        });
    }
    
    startBackgroundMusic() {
        if (!this.initialized || this.isMuted) return;
        
        this.stopBackgroundMusic();
        
        const playMusicLoop = () => {
            const notes = [220, 207, 196, 185];
            notes.forEach((freq, i) => {
                setTimeout(() => {
                    if (!this.isMuted && this.musicInterval) {
                        this.playTone(freq, 0.4, 'triangle');
                    }
                }, i * 500);
            });
        };
        
        playMusicLoop();
        this.musicInterval = setInterval(playMusicLoop, 2500);
    }
    
    stopBackgroundMusic() {
        if (this.musicInterval) {
            clearInterval(this.musicInterval);
            this.musicInterval = null;
        }
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopBackgroundMusic();
        }
        return this.isMuted;
    }
}

// ===================================
// Game State and Configuration
// ===================================

class DnDGame {
    constructor() {
        this.gridSize = 10;
        this.rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        
        this.player = {
            x: 0,
            y: 0,
            hasArrow: false,
            hasRope: false,
            facing: 'north'  // Track which direction player is facing
        };
        
        this.gameActive = false;
        this.score = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.shootingMode = false;
        
        this.dragon = { x: -1, y: -1, alive: true };
        this.arrow = { x: -1, y: -1, collected: false, inFlight: false };
        this.rope = { x: -1, y: -1, collected: false };
        this.pits = [];
        this.bats = [];
        
        this.canvas = null;
        this.ctx = null;
        
        this.audio = new AudioManager();
        
        this.initializeElements();
        this.initializeCanvas();
        this.bindEvents();
        this.newGame();
    }
    
    // ===================================
    // Initialization
    // ===================================
    
    initializeElements() {
        this.scoreDisplay = document.getElementById('score');
        this.timeDisplay = document.getElementById('time');
        this.hasArrowDisplay = document.getElementById('has-arrow');
        this.hasRopeDisplay = document.getElementById('has-rope');
        this.messageDisplay = document.getElementById('message-display');
        
        this.btnNorth = document.getElementById('btn-north');
        this.btnEast = document.getElementById('btn-east');
        this.btnSouth = document.getElementById('btn-south');
        this.btnWest = document.getElementById('btn-west');
        this.btnShoot = document.getElementById('btn-shoot');
        this.btnNewGame = document.getElementById('btn-new-game');
        
        // Modal elements
        this.modal = document.getElementById('instructions-modal');
        this.btnHowToPlay = document.getElementById('btn-how-to-play');
        this.closeButton = document.querySelector('.close-button');
        this.modalCloseBtn = document.getElementById('modal-close-btn');
    }
    
    initializeCanvas() {
        this.canvas = document.getElementById('dungeon-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        const scale = window.devicePixelRatio || 1;
        this.canvas.width = 500 * scale;
        this.canvas.height = 400 * scale;
        this.canvas.style.width = '500px';
        this.canvas.style.height = '400px';
        this.ctx.scale(scale, scale);
    }
    
    bindEvents() {
        this.btnNorth.addEventListener('click', () => {
            this.audio.initialize();
            this.handleDirectionButton('north');
        });
        this.btnEast.addEventListener('click', () => {
            this.audio.initialize();
            this.handleDirectionButton('east');
        });
        this.btnSouth.addEventListener('click', () => {
            this.audio.initialize();
            this.handleDirectionButton('south');
        });
        this.btnWest.addEventListener('click', () => {
            this.audio.initialize();
            this.handleDirectionButton('west');
        });
        
        this.btnShoot.addEventListener('click', () => {
            this.audio.initialize();
            this.initiateShoot();
        });
        this.btnNewGame.addEventListener('click', () => {
            this.audio.initialize();
            this.newGame();
        });
        
        // Modal event listeners
        this.btnHowToPlay.addEventListener('click', () => this.openModal());
        this.closeButton.addEventListener('click', () => this.closeModal());
        this.modalCloseBtn.addEventListener('click', () => this.closeModal());
        
        // Close modal when clicking outside of it
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            this.audio.initialize();
            this.handleKeyPress(e);
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'm') {
                const muted = this.audio.toggleMute();
                this.showMessage(muted ? '🔇 Sound muted' : '🔊 Sound unmuted');
                if (!muted && this.gameActive) {
                    this.audio.startBackgroundMusic();
                }
            }
        });
    }
    
    handleKeyPress(e) {
        if (!this.gameActive) return;
        
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
                if (this.shootingMode) {
                    this.cancelShoot();
                }
                break;
        }
    }
    
    handleDirectionButton(direction) {
        if (this.shootingMode) {
            this.shootArrow(direction);
        } else {
            this.movePlayer(direction);
        }
    }
    
    // ===================================
    // Pathfinding - BFS to check reachability
    // ===================================
    
    isReachable(fromX, fromY, targetX, targetY, avoidPits = true, avoidDragon = true) {
        const queue = [{x: fromX, y: fromY}];
        const visited = new Set();
        visited.add(`${fromX},${fromY}`);
        
        while (queue.length > 0) {
            const current = queue.shift();
            
            if (current.x === targetX && current.y === targetY) {
                return true;
            }
            
            const neighbors = [
                {x: current.x, y: (current.y - 1 + this.gridSize) % this.gridSize},
                {x: (current.x + 1) % this.gridSize, y: current.y},
                {x: current.x, y: (current.y + 1) % this.gridSize},
                {x: (current.x - 1 + this.gridSize) % this.gridSize, y: current.y}
            ];
            
            for (const neighbor of neighbors) {
                const key = `${neighbor.x},${neighbor.y}`;
                
                if (visited.has(key)) continue;
                
                if (avoidPits && this.isPitAt(neighbor.x, neighbor.y)) continue;
                
                if (avoidDragon && this.dragon.alive && 
                    neighbor.x === this.dragon.x && neighbor.y === this.dragon.y) continue;
                
                if (this.isBatAt(neighbor.x, neighbor.y)) continue;
                
                visited.add(key);
                queue.push(neighbor);
            }
        }
        
        return false;
    }
    
    validateGameIsWinnable() {
        const ropeReachable = this.isReachable(0, 0, this.rope.x, this.rope.y, true, true);
        const arrowReachable = this.isReachable(0, 0, this.arrow.x, this.arrow.y, true, true);
        
        return ropeReachable || arrowReachable;
    }
    
    // ===================================
    // Game Logic
    // ===================================
    
    newGame() {
        this.player.x = 0;
        this.player.y = 0;
        this.player.hasArrow = false;
        this.player.hasRope = false;
        this.player.facing = 'north';
        
        this.score = 0;
        this.gameActive = true;
        this.startTime = Date.now();
        this.shootingMode = false;
        
        let attempts = 0;
        let isWinnable = false;
        
        while (!isWinnable && attempts < 100) {
            this.placeEntities();
            isWinnable = this.validateGameIsWinnable();
            attempts++;
        }
        
        if (!isWinnable) {
            console.warn('Could not generate winnable layout after 100 attempts, using last attempt');
        } else {
            console.log(`✅ Generated winnable layout in ${attempts} attempt(s)`);
        }
        
        this.startTimer();
        this.updateDisplay();
        this.renderDungeon();
        this.updateButtonStates();
        
        // Check for initial warnings at starting position
        this.checkProximity('Find the magical arrow, then slay the dragon!');
        
        this.audio.startBackgroundMusic();
    }
    
    placeEntities() {
        const occupiedPositions = new Set();
        occupiedPositions.add('0,0');
        occupiedPositions.add('0,1');
        occupiedPositions.add('1,0');
        
        const getRandomPosition = () => {
            let x, y;
            do {
                x = Math.floor(Math.random() * this.gridSize);
                y = Math.floor(Math.random() * this.gridSize);
            } while (occupiedPositions.has(`${x},${y}`));
            occupiedPositions.add(`${x},${y}`);
            return { x, y };
        };
        
        const dragonPos = getRandomPosition();
        this.dragon.x = dragonPos.x;
        this.dragon.y = dragonPos.y;
        this.dragon.alive = true;
        
        const arrowPos = getRandomPosition();
        this.arrow.x = arrowPos.x;
        this.arrow.y = arrowPos.y;
        this.arrow.collected = false;
        this.arrow.inFlight = false;
        
        const ropePos = getRandomPosition();
        this.rope.x = ropePos.x;
        this.rope.y = ropePos.y;
        this.rope.collected = false;
        
        this.pits = [];
        for (let i = 0; i < 12; i++) {
            const pitPos = getRandomPosition();
            this.pits.push({ x: pitPos.x, y: pitPos.y });
        }
        
        this.bats = [];
        for (let i = 0; i < 3; i++) {
            const batPos = getRandomPosition();
            this.bats.push({ x: batPos.x, y: batPos.y });
        }
        
        console.log(`Entities placed - Dragon: ${this.getCoordinate(this.dragon.x, this.dragon.y)}, Arrow: ${this.getCoordinate(this.arrow.x, this.arrow.y)}, Rope: ${this.getCoordinate(this.rope.x, this.rope.y)}`);
        console.log(`Pits at:`, this.pits.map(p => this.getCoordinate(p.x, p.y)).join(', '));
        console.log(`Bats at:`, this.bats.map(b => this.getCoordinate(b.x, b.y)).join(', '));
    }
    
    movePlayer(direction) {
        if (!this.gameActive || this.shootingMode) return;
        
        // Update facing direction
        this.player.facing = direction;
        
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
        
        this.audio.playMovement();
        
        this.checkPosition();
        this.updateDisplay();
        this.renderDungeon();
    }
    
    checkPosition() {
        const px = this.player.x;
        const py = this.player.y;
        
        // Track if we picked up an item this turn
        let pickupMessage = null;
        
        // Check for bat FIRST (flies you away before anything else)
        if (this.isBatAt(px, py)) {
            this.handleBatEncounter();
            return;
        }
        
        // Check for pit (highest priority danger after bat)
        if (this.isPitAt(px, py)) {
            if (this.player.hasRope) {
                this.player.hasRope = false; // Rope is consumed after use
                this.showMessage('⚠️ You fell in a pit! Your rope saved you! (Rope consumed)');
            } else {
                this.audio.playPitFall();
                this.gameOver('💀 You fell into a pit and died! Game Over!');
                return;
            }
        }
        
        // Check for arrow pickup
        if (!this.arrow.collected && !this.arrow.inFlight && px === this.arrow.x && py === this.arrow.y) {
            this.player.hasArrow = true;
            this.arrow.collected = true;
            this.audio.playItemPickup();
            pickupMessage = 'You found the magical arrow!';
        }
        
        // Check for arrow retrieval (after shooting and missing)
        if (this.arrow.inFlight && px === this.arrow.x && py === this.arrow.y) {
            this.player.hasArrow = true;
            this.arrow.inFlight = false;
            this.arrow.collected = true;
            this.audio.playItemPickup();
            pickupMessage = 'You retrieved your arrow!';
        }
        
        // Check for rope pickup
        if (!this.rope.collected && px === this.rope.x && py === this.rope.y) {
            this.player.hasRope = true;
            this.rope.collected = true;
            this.audio.playItemPickup();
            pickupMessage = 'You found a rope! It will save you from pits!';
        }
        
        // Check for dragon (game over if you walk into it)
        if (this.dragon.alive && px === this.dragon.x && py === this.dragon.y) {
            this.audio.playDragonRoar();
            this.gameOver('🐉 The dragon devoured you! Game Over!');
            return;
        }
        
        // Check proximity to dangers and combine with pickup message if needed
        this.checkProximity(pickupMessage);
    }
    
    isPitAt(x, y) {
        return this.pits.some(pit => pit.x === x && pit.y === y);
    }
    
    isBatAt(x, y) {
        return this.bats.some(bat => bat.x === x && bat.y === y);
    }
    
    handleBatEncounter() {
        this.audio.playBatFlap();
        
        // Find which bat the player encountered
        const batIndex = this.bats.findIndex(bat => bat.x === this.player.x && bat.y === this.player.y);
        
        let newX, newY;
        do {
            newX = Math.floor(Math.random() * this.gridSize);
            newY = Math.floor(Math.random() * this.gridSize);
        } while (
            (newX === this.player.x && newY === this.player.y) || // Not same position
            this.isBatAt(newX, newY) // Not on another bat
        );
        
        const oldCoord = this.getCoordinate(this.player.x, this.player.y);
        this.player.x = newX;
        this.player.y = newY;
        const newCoord = this.getCoordinate(this.player.x, this.player.y);
        
        // Remove the bat from the array (it disappears after one use)
        if (batIndex !== -1) {
            this.bats.splice(batIndex, 1);
            console.log(`Bat removed. ${this.bats.length} bat(s) remaining.`);
        }
        
        const batMessage = `🦇 A bat grabbed you and flew you from ${oldCoord} to ${newCoord}!`;
        console.log(batMessage);
        
        this.updateDisplay();
        this.renderDungeon();
        this.checkPositionAfterFlight(batMessage);
        this.updateDisplay(); // Update again in case rope was consumed
    }
    
    checkPositionAfterFlight(flightMessage) {
        const px = this.player.x;
        const py = this.player.y;
        
        // Check if landed in pit
        if (this.isPitAt(px, py)) {
            if (this.player.hasRope) {
                this.player.hasRope = false; // Rope is consumed after use
                // Add pit message to flight message and continue to check proximity
                flightMessage = `${flightMessage} | ⚠️ Landed in a pit! Your rope saved you! (Rope consumed)`;
            } else {
                this.audio.playPitFall();
                this.gameOver('💀 Bat dropped you into a pit! You died! Game Over!');
                return;
            }
        }
        
        // Check if landed on dragon
        if (this.dragon.alive && px === this.dragon.x && py === this.dragon.y) {
            this.audio.playDragonRoar();
            this.gameOver('🐉 Bat dropped you on the dragon! You were devoured! Game Over!');
            return;
        }
        
        // Check proximity and combine with flight message (and any pit message)
        this.checkProximityAfterFlight(flightMessage);
    }
    
    checkProximityAfterFlight(flightMessage) {
        const px = this.player.x;
        const py = this.player.y;
        let warnings = [];
        
        if (this.dragon.alive) {
            let dragonNearby = false;
            
            if (this.isAdjacent(px, py, 'north', this.dragon.x, this.dragon.y) ||
                this.isAdjacent(px, py, 'east', this.dragon.x, this.dragon.y) ||
                this.isAdjacent(px, py, 'south', this.dragon.x, this.dragon.y) ||
                this.isAdjacent(px, py, 'west', this.dragon.x, this.dragon.y)) {
                dragonNearby = true;
            }
            
            if (dragonNearby) {
                warnings.push('🐉 DRAGON roars nearby!');
                this.audio.playDragonRoar();
            }
        }
        
        let pitNearby = false;
        for (const pit of this.pits) {
            if (this.isAdjacent(px, py, 'north', pit.x, pit.y) ||
                this.isAdjacent(px, py, 'east', pit.x, pit.y) ||
                this.isAdjacent(px, py, 'south', pit.x, pit.y) ||
                this.isAdjacent(px, py, 'west', pit.x, pit.y)) {
                pitNearby = true;
                break;
            }
        }
        
        if (pitNearby) {
            warnings.push('⚠️ You feel a breeze... pit nearby!');
            this.audio.playPitBreezeWarning();
        }
        
        let batNearby = false;
        for (const bat of this.bats) {
            if (this.isAdjacent(px, py, 'north', bat.x, bat.y) ||
                this.isAdjacent(px, py, 'east', bat.x, bat.y) ||
                this.isAdjacent(px, py, 'south', bat.x, bat.y) ||
                this.isAdjacent(px, py, 'west', bat.x, bat.y)) {
                batNearby = true;
                break;
            }
        }
        
        if (batNearby) {
            warnings.push('🦇 You hear flapping wings...');
            this.audio.playBatWingsWarning();
        }
        
        if (warnings.length > 0) {
            this.showMessage(`${flightMessage} | ${warnings.join(' | ')}`);
        } else {
            this.showMessage(flightMessage);
        }
    }
    
    checkProximity(pickupMessage = null) {
        const px = this.player.x;
        const py = this.player.y;
        let warnings = [];
        
        if (this.dragon.alive) {
            let dragonNearby = false;
            
            if (this.isAdjacent(px, py, 'north', this.dragon.x, this.dragon.y) ||
                this.isAdjacent(px, py, 'east', this.dragon.x, this.dragon.y) ||
                this.isAdjacent(px, py, 'south', this.dragon.x, this.dragon.y) ||
                this.isAdjacent(px, py, 'west', this.dragon.x, this.dragon.y)) {
                dragonNearby = true;
            }
            
            if (dragonNearby) {
                warnings.push('🐉 DRAGON roars nearby!');
                this.audio.playDragonRoar();
            }
        }
        
        let pitNearby = false;
        for (const pit of this.pits) {
            if (this.isAdjacent(px, py, 'north', pit.x, pit.y) ||
                this.isAdjacent(px, py, 'east', pit.x, pit.y) ||
                this.isAdjacent(px, py, 'south', pit.x, pit.y) ||
                this.isAdjacent(px, py, 'west', pit.x, pit.y)) {
                pitNearby = true;
                break;
            }
        }
        
        if (pitNearby) {
            warnings.push(`⚠️ You feel a breeze... pit nearby!`);
            this.audio.playPitBreezeWarning();
        }
        
        let batNearby = false;
        for (const bat of this.bats) {
            if (this.isAdjacent(px, py, 'north', bat.x, bat.y) ||
                this.isAdjacent(px, py, 'east', bat.x, bat.y) ||
                this.isAdjacent(px, py, 'south', bat.x, bat.y) ||
                this.isAdjacent(px, py, 'west', bat.x, bat.y)) {
                batNearby = true;
                break;
            }
        }
        
        if (batNearby) {
            warnings.push(`🦇 You hear flapping wings...`);
            this.audio.playBatWingsWarning();
        }
        
        // Combine pickup message with proximity warnings
        if (pickupMessage) {
            if (warnings.length > 0) {
                this.showMessage(`${pickupMessage} | ${warnings.join(' | ')}`);
            } else {
                this.showMessage(pickupMessage);
            }
        } else {
            if (warnings.length > 0) {
                this.showMessage(warnings.join(' | '));
            } else {
                this.showMessage('Moving through the dungeon...');
            }
        }
    }
    
    isAdjacent(px, py, direction, targetX, targetY) {
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
        
        this.shootingMode = true;
        this.showMessage('🏹 Select a direction to shoot! (or ESC to cancel)');
        this.updateButtonStates();
        this.renderDungeon(); // Re-render to show shooting pose
    }
    
    cancelShoot() {
        this.shootingMode = false;
        this.showMessage('Shooting cancelled.');
        this.updateButtonStates();
        this.renderDungeon(); // Re-render to show standing pose
    }
    
    shootArrow(direction) {
        if (!this.gameActive || !this.shootingMode) return;
        
        // Update facing direction for shooting
        this.player.facing = direction;
        
        this.shootingMode = false;
        this.player.hasArrow = false;
        
        this.audio.playArrowShot();
        
        const arrowPath = this.calculateArrowPath(direction);
        
        if (this.isDragonInPath(arrowPath)) {
            this.dragon.alive = false;
            this.win();
        } else {
            const landingSpot = arrowPath[arrowPath.length - 1];
            this.arrow.x = landingSpot.x;
            this.arrow.y = landingSpot.y;
            this.arrow.inFlight = true;
            this.arrow.collected = false;
            
            const coordinate = this.getCoordinate(this.arrow.x, this.arrow.y);
            this.showMessage(`💨 Your arrow missed! It landed at ${coordinate}. Go retrieve it!`);
            
            this.repositionDragon();
        }
        
        this.updateDisplay();
        this.renderDungeon();
        this.updateButtonStates();
    }
    
    calculateArrowPath(direction) {
        const path = [];
        let x = this.player.x;
        let y = this.player.y;
        
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
    // Canvas Rendering - NEW GRID VIEW
    // ===================================
    
    renderDungeon() {
        const ctx = this.ctx;
        const width = 500;
        const height = 400;
        
        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
        
        // Draw grid lines
        this.drawGrid(ctx);
        
        // Draw row/column labels
        this.drawLabels(ctx);
        
        // Highlight current cell
        this.highlightCurrentCell(ctx);
        
        // Draw dead dragon if killed
        if (!this.dragon.alive) {
            this.drawDeadDragon(ctx);
        }
        
        // Draw adjacent warnings (entities near player)
        //this.drawAdjacentWarnings(ctx); //currently removed for purposes of making this more challenging
        
        // Draw player (on top of everything)
        this.drawPlayer(ctx);
    }
    
    drawGrid(ctx) {
        const cellWidth = 50;
        const cellHeight = 40;
        
        // Draw grid lines
        ctx.strokeStyle = '#006600';
        ctx.lineWidth = 1;
        
        // Vertical lines (columns)
        for (let x = 0; x <= 10; x++) {
            ctx.beginPath();
            ctx.moveTo(x * cellWidth, 0);
            ctx.lineTo(x * cellWidth, 400);
            ctx.stroke();
        }
        
        // Horizontal lines (rows)
        for (let y = 0; y <= 10; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * cellHeight);
            ctx.lineTo(500, y * cellHeight);
            ctx.stroke();
        }
    }
    
    drawLabels(ctx) {
        const cellWidth = 50;
        const cellHeight = 40;
        
        ctx.fillStyle = '#00ff00';
        ctx.font = 'bold 12px Courier New';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Column labels (0-9) - top of grid
        for (let x = 0; x < 10; x++) {
            ctx.fillText(x.toString(), x * cellWidth + cellWidth / 2, 12);
        }
        
        // Row labels (A-J) - left of grid
        ctx.textAlign = 'left';
        for (let y = 0; y < 10; y++) {
            ctx.fillText(this.rows[y], 5, y * cellHeight + cellHeight / 2);
        }
    }
    
    highlightCurrentCell(ctx) {
        const cellWidth = 50;
        const cellHeight = 40;
        
        // Highlight player's current cell
        ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
        ctx.fillRect(
            this.player.x * cellWidth,
            this.player.y * cellHeight,
            cellWidth,
            cellHeight
        );
        
        // Border around current cell
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            this.player.x * cellWidth,
            this.player.y * cellHeight,
            cellWidth,
            cellHeight
        );
    }
    
    drawDeadDragon(ctx) {
        const cellWidth = 50;
        const cellHeight = 40;
        
        // Calculate center of dragon's cell
        const centerX = this.dragon.x * cellWidth + cellWidth / 2;
        const centerY = this.dragon.y * cellHeight + cellHeight / 2;
        
        // Draw dragon emoji
        ctx.font = 'bold 24px Courier New';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ff0000'; // Red color for dead dragon
        ctx.fillText('🐉', centerX, centerY);
    }
    
    drawPlayer(ctx) {
        const cellWidth = 50;
        const cellHeight = 40;
        
        // Calculate center of player's cell
        const centerX = this.player.x * cellWidth + cellWidth / 2;
        const centerY = this.player.y * cellHeight + cellHeight / 2;
        
        // Draw player sprite with current animation state
        this.drawPlayerSprite(ctx, centerX, centerY);
    }
    
    drawPlayerSprite(ctx, x, y) {
        ctx.fillStyle = '#00ff00';
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Get current facing direction (default to north)
        const direction = this.player.facing || 'north';
        
        // Draw based on animation state
        if (this.shootingMode) {
            this.drawArcherShooting(ctx, x, y, direction);
        } else {
            this.drawArcherStanding(ctx, x, y, direction);
        }
    }
    
    drawArcherStanding(ctx, x, y, direction) {
        switch(direction) {
            case 'north':
                this.drawArcherNorth(ctx, x, y, false);
                break;
            case 'south':
                this.drawArcherSouth(ctx, x, y, false);
                break;
            case 'east':
                this.drawArcherEast(ctx, x, y, false);
                break;
            case 'west':
                this.drawArcherWest(ctx, x, y, false);
                break;
        }
    }
    
    drawArcherShooting(ctx, x, y, direction) {
        switch(direction) {
            case 'north':
                this.drawArcherNorth(ctx, x, y, true);
                break;
            case 'south':
                this.drawArcherSouth(ctx, x, y, true);
                break;
            case 'east':
                this.drawArcherEast(ctx, x, y, true);
                break;
            case 'west':
                this.drawArcherWest(ctx, x, y, true);
                break;
        }
    }
    
    // North-facing archer
    drawArcherNorth(ctx, x, y, shooting) {
        // Head
        ctx.beginPath();
        ctx.arc(x, y - 8, 3.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Body
        ctx.beginPath();
        ctx.moveTo(x, y - 4);
        ctx.lineTo(x, y + 6);
        ctx.stroke();
        
        if (shooting) {
            // Arms raised, holding bow
            // Left arm extended
            ctx.beginPath();
            ctx.moveTo(x, y - 2);
            ctx.lineTo(x - 7, y - 6);
            ctx.stroke();
            
            // Right arm pulling string
            ctx.beginPath();
            ctx.moveTo(x, y - 2);
            ctx.lineTo(x + 5, y - 3);
            ctx.stroke();
            
            // Bow
            ctx.beginPath();
            ctx.arc(x - 7, y - 6, 4, -Math.PI * 0.7, -Math.PI * 0.3, false);
            ctx.stroke();
            
            // Arrow
            ctx.beginPath();
            ctx.moveTo(x - 7, y - 6);
            ctx.lineTo(x - 7, y - 12);
            ctx.stroke();
            
            // Arrowhead
            ctx.beginPath();
            ctx.moveTo(x - 7, y - 12);
            ctx.lineTo(x - 8, y - 10);
            ctx.moveTo(x - 7, y - 12);
            ctx.lineTo(x - 6, y - 10);
            ctx.stroke();
        } else {
            // Arms at sides with bow
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - 6, y + 2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 6, y + 2);
            ctx.stroke();
            
            // Bow on back
            ctx.beginPath();
            ctx.arc(x - 4, y - 1, 3, Math.PI * 0.3, Math.PI * 0.7);
            ctx.stroke();
        }
        
        // Legs
        ctx.beginPath();
        ctx.moveTo(x, y + 6);
        ctx.lineTo(x - 3, y + 12);
        ctx.moveTo(x, y + 6);
        ctx.lineTo(x + 3, y + 12);
        ctx.stroke();
    }
    
    // South-facing archer
    drawArcherSouth(ctx, x, y, shooting) {
        // Head
        ctx.beginPath();
        ctx.arc(x, y - 8, 3.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Body
        ctx.beginPath();
        ctx.moveTo(x, y - 4);
        ctx.lineTo(x, y + 6);
        ctx.stroke();
        
        if (shooting) {
            // Arms raised, holding bow
            ctx.beginPath();
            ctx.moveTo(x, y - 2);
            ctx.lineTo(x - 7, y - 4);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(x, y - 2);
            ctx.lineTo(x + 5, y - 2);
            ctx.stroke();
            
            // Bow
            ctx.beginPath();
            ctx.arc(x - 7, y - 4, 4, Math.PI * 0.3, Math.PI * 0.7, false);
            ctx.stroke();
            
            // Arrow pointing down
            ctx.beginPath();
            ctx.moveTo(x - 7, y - 4);
            ctx.lineTo(x - 7, y + 4);
            ctx.stroke();
            
            // Arrowhead
            ctx.beginPath();
            ctx.moveTo(x - 7, y + 4);
            ctx.lineTo(x - 8, y + 2);
            ctx.moveTo(x - 7, y + 4);
            ctx.lineTo(x - 6, y + 2);
            ctx.stroke();
        } else {
            // Arms at sides
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - 6, y + 2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 6, y + 2);
            ctx.stroke();
            
            // Bow visible
            ctx.beginPath();
            ctx.arc(x + 4, y, 3, -Math.PI * 0.3, Math.PI * 0.3);
            ctx.stroke();
        }
        
        // Legs
        ctx.beginPath();
        ctx.moveTo(x, y + 6);
        ctx.lineTo(x - 3, y + 12);
        ctx.moveTo(x, y + 6);
        ctx.lineTo(x + 3, y + 12);
        ctx.stroke();
    }
    
    // East-facing archer
    drawArcherEast(ctx, x, y, shooting) {
        // Head (profile)
        ctx.beginPath();
        ctx.arc(x + 2, y - 8, 3.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Body
        ctx.beginPath();
        ctx.moveTo(x + 2, y - 4);
        ctx.lineTo(x + 2, y + 6);
        ctx.stroke();
        
        if (shooting) {
            // Left arm extended forward
            ctx.beginPath();
            ctx.moveTo(x + 2, y - 2);
            ctx.lineTo(x + 10, y - 4);
            ctx.stroke();
            
            // Right arm pulling string back
            ctx.beginPath();
            ctx.moveTo(x + 2, y - 2);
            ctx.lineTo(x - 4, y - 1);
            ctx.stroke();
            
            // Bow
            ctx.beginPath();
            ctx.arc(x + 10, y - 4, 4, -Math.PI * 0.5, Math.PI * 0.5, false);
            ctx.stroke();
            
            // Arrow pointing right
            ctx.beginPath();
            ctx.moveTo(x - 2, y - 2);
            ctx.lineTo(x + 10, y - 4);
            ctx.stroke();
            
            // Arrowhead
            ctx.beginPath();
            ctx.moveTo(x + 10, y - 4);
            ctx.lineTo(x + 8, y - 5);
            ctx.moveTo(x + 10, y - 4);
            ctx.lineTo(x + 8, y - 3);
            ctx.stroke();
        } else {
            // Arms at sides
            ctx.beginPath();
            ctx.moveTo(x + 2, y);
            ctx.lineTo(x + 7, y + 2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(x + 2, y);
            ctx.lineTo(x - 3, y + 1);
            ctx.stroke();
            
            // Bow on back
            ctx.beginPath();
            ctx.arc(x, y, 3, -Math.PI * 0.3, Math.PI * 0.3);
            ctx.stroke();
        }
        
        // Legs
        ctx.beginPath();
        ctx.moveTo(x + 2, y + 6);
        ctx.lineTo(x, y + 12);
        ctx.moveTo(x + 2, y + 6);
        ctx.lineTo(x + 4, y + 12);
        ctx.stroke();
    }
    
    // West-facing archer
    drawArcherWest(ctx, x, y, shooting) {
        // Head (profile)
        ctx.beginPath();
        ctx.arc(x - 2, y - 8, 3.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Body
        ctx.beginPath();
        ctx.moveTo(x - 2, y - 4);
        ctx.lineTo(x - 2, y + 6);
        ctx.stroke();
        
        if (shooting) {
            // Left arm extended forward
            ctx.beginPath();
            ctx.moveTo(x - 2, y - 2);
            ctx.lineTo(x - 10, y - 4);
            ctx.stroke();
            
            // Right arm pulling string back
            ctx.beginPath();
            ctx.moveTo(x - 2, y - 2);
            ctx.lineTo(x + 4, y - 1);
            ctx.stroke();
            
            // Bow
            ctx.beginPath();
            ctx.arc(x - 10, y - 4, 4, Math.PI * 0.5, Math.PI * 1.5, false);
            ctx.stroke();
            
            // Arrow pointing left
            ctx.beginPath();
            ctx.moveTo(x + 2, y - 2);
            ctx.lineTo(x - 10, y - 4);
            ctx.stroke();
            
            // Arrowhead
            ctx.beginPath();
            ctx.moveTo(x - 10, y - 4);
            ctx.lineTo(x - 8, y - 5);
            ctx.moveTo(x - 10, y - 4);
            ctx.lineTo(x - 8, y - 3);
            ctx.stroke();
        } else {
            // Arms at sides
            ctx.beginPath();
            ctx.moveTo(x - 2, y);
            ctx.lineTo(x - 7, y + 2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(x - 2, y);
            ctx.lineTo(x + 3, y + 1);
            ctx.stroke();
            
            // Bow on back
            ctx.beginPath();
            ctx.arc(x, y, 3, Math.PI * 0.7, Math.PI * 1.3);
            ctx.stroke();
        }
        
        // Legs
        ctx.beginPath();
        ctx.moveTo(x - 2, y + 6);
        ctx.lineTo(x - 4, y + 12);
        ctx.moveTo(x - 2, y + 6);
        ctx.lineTo(x, y + 12);
        ctx.stroke();
    }
    
    drawAdjacentWarnings(ctx) {
        const cellWidth = 50;
        const cellHeight = 40;
        const px = this.player.x;
        const py = this.player.y;
        
        // Check all 4 adjacent cells
        const adjacentCells = [
            { x: px, y: (py - 1 + this.gridSize) % this.gridSize, dir: 'N' },      // North
            { x: (px + 1) % this.gridSize, y: py, dir: 'E' },                      // East
            { x: px, y: (py + 1) % this.gridSize, dir: 'S' },                      // South
            { x: (px - 1 + this.gridSize) % this.gridSize, y: py, dir: 'W' }      // West
        ];
        
        ctx.font = 'bold 16px Courier New';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        for (const cell of adjacentCells) {
            const centerX = cell.x * cellWidth + cellWidth / 2;
            const centerY = cell.y * cellHeight + cellHeight / 2;
            
            // Check for dragon
            if (this.dragon.alive && cell.x === this.dragon.x && cell.y === this.dragon.y) {
                ctx.fillStyle = '#ff0000';
                ctx.fillText('🐉', centerX, centerY);
            }
            
            // Check for pit
            else if (this.isPitAt(cell.x, cell.y)) {
                ctx.fillStyle = '#ffaa00';
                ctx.fillText('⚠', centerX, centerY);
            }
            
            // Check for bat
            else if (this.isBatAt(cell.x, cell.y)) {
                ctx.fillStyle = '#aa00ff';
                ctx.fillText('🦇', centerX, centerY);
            }
            
            // Check for arrow (if not collected and not in flight)
            else if (!this.arrow.collected && !this.arrow.inFlight && 
                     cell.x === this.arrow.x && cell.y === this.arrow.y) {
                ctx.fillStyle = '#00ffff';
                ctx.fillText('🏹', centerX, centerY);
            }
            
            // Check for arrow (if in flight after missed shot)
            else if (this.arrow.inFlight && cell.x === this.arrow.x && cell.y === this.arrow.y) {
                ctx.fillStyle = '#00ffff';
                ctx.fillText('🏹', centerX, centerY);
            }
            
            // Check for rope
            else if (!this.rope.collected && cell.x === this.rope.x && cell.y === this.rope.y) {
                ctx.fillStyle = '#ffff00';
                ctx.fillText('🪢', centerX, centerY);
            }
        }
    }
    
    // ===================================
    // Display Updates
    // ===================================
    
    updateDisplay() {        
        this.scoreDisplay.textContent = this.score;
        this.hasArrowDisplay.textContent = this.player.hasArrow ? 'Yes' : 'No';
        this.hasRopeDisplay.textContent = this.player.hasRope ? 'Yes' : 'No';
    }
    
    updateButtonStates() {
        if (this.shootingMode) {
            this.btnNorth.style.backgroundColor = '#004400';
            this.btnEast.style.backgroundColor = '#004400';
            this.btnSouth.style.backgroundColor = '#004400';
            this.btnWest.style.backgroundColor = '#004400';
            this.btnShoot.textContent = 'CANCEL';
            this.btnShoot.style.backgroundColor = '#440000';
        } else {
            this.btnNorth.style.backgroundColor = '';
            this.btnEast.style.backgroundColor = '';
            this.btnSouth.style.backgroundColor = '';
            this.btnWest.style.backgroundColor = '';
            this.btnShoot.textContent = 'SHOOT';
            this.btnShoot.style.backgroundColor = '';
        }
    }
    
    getCoordinate(x, y) {
        return this.rows[y] + x;
    }
    
    showMessage(message) {
        this.messageDisplay.textContent = message;
    }
    
    // ===================================
    // Timer
    // ===================================
    
    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
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
        this.audio.stopBackgroundMusic();
        this.showMessage(message);
    }
    
    win() {
        this.gameActive = false;
        clearInterval(this.timerInterval);
        this.audio.stopBackgroundMusic();
        this.audio.playVictory();
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        this.score = Math.floor(elapsed / 5);
        this.scoreDisplay.textContent = this.score;
        
        this.showMessage(`🎉 VICTORY! You slayed the dragon! Score: ${this.score} 🎉`);
    }
    
    // ===================================
    // Modal Controls
    // ===================================
    
    openModal() {
        this.modal.style.display = 'block';
    }
    
    closeModal() {
        this.modal.style.display = 'none';
    }
}

// ===================================
// Initialize Game
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const game = new DnDGame();
    
    setTimeout(() => {
        console.log('🔊 Tip: Press "M" to mute/unmute sound effects');
    }, 2000);
});