// Mafia Game State - Handles all game logic
// In-person narrator mode

class MafiaPlayer {
    constructor(name, role) {
        this.name = name;
        this.role = role; // 'mafia', 'doctor', 'detective', 'villager'
        this.alive = true;
        this.killedBy = null; // 'mafia', 'vote', null
        this.savedByDoctor = false; // Flag for this night
        this.wasSuspected = false; // Flag for current day
    }
}

class MafiaGameState {
    constructor(playerNames, numMafia, discussionTime) {
        this.discussionTime = discussionTime; // seconds
        this.phase = 'night'; // 'night' or 'day'
        this.nightStep = 'mafia'; // 'mafia', 'doctor', 'detective'
        this.roundNumber = 1;
        
        // Assign roles randomly
        this.players = this.assignRoles(playerNames, numMafia);
        
        // Track actions this round
        this.killedThisNight = null; // Player object
        this.revivedThisNight = null; // Player object
        this.suspectedThisDay = null; // Player object
        this.votedOutThisDay = null; // Player object
        
        // Track doctor's self-save
        this.doctorHasSavedSelf = false;
        
        // For undo functionality
        this.lastAction = null; // { type, player, data }
        
        // Game over
        this.gameOver = false;
        this.winner = null; // 'mafia' or 'villagers'
    }
    
    // Randomly assign roles
    assignRoles(playerNames, numMafia) {
        const shuffled = [...playerNames].sort(() => Math.random() - 0.5);
        const players = [];
        
        // Assign mafia
        for (let i = 0; i < numMafia; i++) {
            players.push(new MafiaPlayer(shuffled[i], 'mafia'));
        }
        
        // Assign doctor
        players.push(new MafiaPlayer(shuffled[numMafia], 'doctor'));
        
        // Assign detective
        players.push(new MafiaPlayer(shuffled[numMafia + 1], 'detective'));
        
        // Rest are villagers
        for (let i = numMafia + 2; i < shuffled.length; i++) {
            players.push(new MafiaPlayer(shuffled[i], 'villager'));
        }
        
        return players;
    }
    
    // Get player by name
    getPlayer(name) {
        return this.players.find(p => p.name === name);
    }
    
    // Get alive players
    getAlivePlayers() {
        return this.players.filter(p => p.alive);
    }
    
    // Get dead players
    getDeadPlayers() {
        return this.players.filter(p => !p.alive);
    }
    
    // Get players by role
    getPlayersByRole(role) {
        return this.players.filter(p => p.role === role);
    }
    
    // Get alive mafia
    getAliveMafia() {
        return this.players.filter(p => p.role === 'mafia' && p.alive);
    }
    
    // Mafia kills someone
    mafiaKill(playerName) {
        const player = this.getPlayer(playerName);
        if (!player || !player.alive) return false;
        
        // Store for potential doctor save
        this.killedThisNight = player;
        player.killedBy = 'mafia';
        player.alive = false;
        
        this.lastAction = { type: 'mafiaKill', player: playerName };
        return true;
    }
    
    // Doctor heals someone (protects them from mafia kill this night)
    doctorHeal(playerName) {
        const player = this.getPlayer(playerName);
        const doctor = this.getPlayersByRole('doctor')[0];
        
        // Doctor must be alive to heal
        if (!doctor || !doctor.alive) return false;
        
        // Can only heal alive players
        if (!player || !player.alive) return false;
        
        // Check if doctor is trying to save themselves (only once per game)
        if (player.name === doctor.name && this.doctorHasSavedSelf) {
            return false; // Can't save self twice
        }
        
        // Mark this player as protected
        // If they were killed by mafia, revive them
        if (player.killedBy === 'mafia' && !player.alive) {
            player.alive = true;
            player.savedByDoctor = true;
            this.revivedThisNight = player;
        } else {
            // Heal wasted - player wasn't killed
            // But still mark as "protected" for visual feedback
            player.savedByDoctor = true;
            this.revivedThisNight = player;
        }
        
        // Track if doctor saved themselves
        if (player.name === doctor.name) {
            this.doctorHasSavedSelf = true;
        }
        
        this.lastAction = { type: 'doctorHeal', player: playerName };
        return true;
    }
    
    // Detective suspects someone
    detectiveSuspect(playerName) {
        const player = this.getPlayer(playerName);
        if (!player || !player.alive) return false;
        
        // Clear previous suspect indicator
        if (this.suspectedThisDay) {
            this.suspectedThisDay.wasSuspected = false;
        }
        
        player.wasSuspected = true;
        this.suspectedThisDay = player;
        
        this.lastAction = { type: 'detectiveSuspect', player: playerName };
        return true;
    }
    
    // Vote someone out during day phase
    voteOut(playerName) {
        const player = this.getPlayer(playerName);
        if (!player || !player.alive) return false;
        
        player.alive = false;
        player.killedBy = 'vote';
        this.votedOutThisDay = player;
        
        this.lastAction = { type: 'voteOut', player: playerName };
        return true;
    }
    
    // Undo last action
    undo() {
        if (!this.lastAction) return false;
        
        const { type, player: playerName } = this.lastAction;
        const player = this.getPlayer(playerName);
        
        switch (type) {
            case 'mafiaKill':
                player.alive = true;
                player.killedBy = null;
                this.killedThisNight = null;
                break;
                
            case 'doctorHeal':
                // Undo heal - if player was revived, kill them again
                if (this.revivedThisNight && this.revivedThisNight.name === playerName) {
                    player.alive = false;
                    player.killedBy = 'mafia';
                }
                player.savedByDoctor = false;
                this.revivedThisNight = null;
                // If undoing self-save, restore ability
                if (player.role === 'doctor') {
                    this.doctorHasSavedSelf = false;
                }
                break;
                
            case 'detectiveSuspect':
                player.wasSuspected = false;
                this.suspectedThisDay = null;
                break;
                
            case 'voteOut':
                player.alive = true;
                player.killedBy = null;
                this.votedOutThisDay = null;
                break;
        }
        
        this.lastAction = null;
        return true;
    }
    
    // Move to next night step (mafia → doctor → detective)
    nextNightStep() {
        if (this.nightStep === 'mafia') {
            this.nightStep = 'doctor';
        } else if (this.nightStep === 'doctor') {
            this.nightStep = 'detective';
        } else {
            // Night is over, move to day
            this.phase = 'day';
            this.clearNightIndicators();
        }
        
        this.lastAction = null; // Clear undo after phase change
    }
    
    // Move to next day phase (day → night)
    nextDayPhase() {
        this.phase = 'night';
        this.nightStep = 'mafia';
        this.roundNumber++;
        this.clearDayIndicators();
        this.lastAction = null;
    }
    
    // Clear night indicators (saved, killed)
    clearNightIndicators() {
        this.killedThisNight = null;
        this.revivedThisNight = null;
        this.players.forEach(p => {
            p.savedByDoctor = false;
        });
    }
    
    // Clear day indicators (suspected, voted out)
    clearDayIndicators() {
        this.suspectedThisDay = null;
        this.votedOutThisDay = null;
        this.players.forEach(p => {
            p.wasSuspected = false;
        });
    }
    
    // Check win conditions
    checkWinCondition() {
        const aliveMafia = this.getAliveMafia().length;
        const aliveVillagers = this.getAlivePlayers().filter(p => p.role !== 'mafia').length;
        
        // Mafia wins if mafia >= villagers
        if (aliveMafia >= aliveVillagers) {
            this.gameOver = true;
            this.winner = 'mafia';
            return { over: true, winner: 'mafia' };
        }
        
        // Villagers win if all mafia dead
        if (aliveMafia === 0) {
            this.gameOver = true;
            this.winner = 'villagers';
            return { over: true, winner: 'villagers' };
        }
        
        return { over: false, winner: null };
    }
    
    // Get current phase display text
    getCurrentPhaseText() {
        if (this.phase === 'night') {
            switch (this.nightStep) {
                case 'mafia': return 'Night Phase - Mafia\'s Turn';
                case 'doctor': return 'Night Phase - Doctor\'s Turn';
                case 'detective': return 'Night Phase - Detective\'s Turn';
            }
        } else {
            return 'Day Phase - Discussion & Voting';
        }
    }
    
    // Get game state summary
    getGameSummary() {
        return {
            phase: this.phase,
            nightStep: this.nightStep,
            roundNumber: this.roundNumber,
            alivePlayers: this.getAlivePlayers().length,
            deadPlayers: this.getDeadPlayers().length,
            aliveMafia: this.getAliveMafia().length,
            gameOver: this.gameOver,
            winner: this.winner
        };
    }
}

export default MafiaGameState;
export { MafiaPlayer };