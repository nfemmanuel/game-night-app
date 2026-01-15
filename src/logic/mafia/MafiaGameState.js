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
        this.revivedThisNight = null; // Player object (only if actually revived from death)
        this.suspectedThisDay = null; // Player object
        this.votedOutThisDay = null; // Player object
        
        // Track if action taken this turn (one action per role per turn)
        this.mafiaActionTaken = false;
        this.doctorActionTaken = false;
        this.detectiveActionTaken = false;
        
        // Track doctor's self-save
        this.doctorHasSavedSelf = false;
        
        // For undo functionality
        this.lastAction = null; // { type, player, data }
        
        // Game over
        this.gameOver = false;
        this.winner = null; // 'mafia' or 'villagers'
    }
    
    // Randomly assign roles (but keep player order)
    assignRoles(playerNames, numMafia) {
        const players = playerNames.map(name => new MafiaPlayer(name, 'unassigned'));
        
        // Create array of roles
        const roles = [];
        for (let i = 0; i < numMafia; i++) roles.push('mafia');
        roles.push('doctor');
        roles.push('detective');
        for (let i = 0; i < playerNames.length - numMafia - 2; i++) {
            roles.push('villager');
        }
        
        // Shuffle the roles array
        const shuffledRoles = roles.sort(() => Math.random() - 0.5);
        
        // Assign shuffled roles to players in order
        players.forEach((player, index) => {
            player.role = shuffledRoles[index];
        });
        
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
    
    // Get alive players (for display - includes recently killed during night phase)
    getAlivePlayersForDisplay() {
        if (this.phase === 'night') {
            // During night, show all players who were alive at start of night
            return this.players.filter(p => {
                // Show if currently alive OR killed this night (not yet separated)
                return p.alive || p.killedBy === 'mafia';
            });
        } else {
            // During day, only show actually alive players
            return this.players.filter(p => p.alive);
        }
    }
    
    // Get dead players (for display - excludes recently killed during night phase)
    getDeadPlayersForDisplay() {
        if (this.phase === 'night') {
            // During night, don't show newly killed in dead section
            return this.players.filter(p => !p.alive && p.killedBy !== 'mafia');
        } else {
            // During day, show all dead players
            return this.players.filter(p => !p.alive);
        }
    }
    
    // Get players by role
    getPlayersByRole(role) {
        return this.players.filter(p => p.role === role);
    }
    
    // Get alive mafia
    getAliveMafia() {
        return this.players.filter(p => p.role === 'mafia' && p.alive);
    }
    
    // Mafia kills someone (marks them for death)
    mafiaKill(playerName) {
        const player = this.getPlayer(playerName);
        if (!player || !player.alive) return false;
        
        // Mafia can't kill themselves
        if (player.role === 'mafia') return false;
        
        // Only one action per turn
        if (this.mafiaActionTaken) return false;
        
        // Mark player for death (don't kill yet, doctor might save)
        this.killedThisNight = player;
        player.killedBy = 'mafia';
        player.alive = false; // Tentatively dead
        
        this.mafiaActionTaken = true;
        this.lastAction = { type: 'mafiaKill', player: playerName };
        return true;
    }
    
    // Doctor heals someone (protects them from mafia kill this night)
    doctorHeal(playerName) {
        const player = this.getPlayer(playerName);
        const doctor = this.getPlayersByRole('doctor')[0];
        
        // Doctor must be alive OR just killed this night (can still act if just killed)
        const doctorCanAct = doctor && (doctor.alive || (doctor.killedBy === 'mafia' && this.killedThisNight === doctor));
        if (!doctorCanAct) return false;
        
        // Only one action per turn
        if (this.doctorActionTaken) return false;
        
        // Can heal alive players OR newly killed players this night
        const canHeal = player.alive || (player.killedBy === 'mafia' && this.killedThisNight === player);
        if (!player || !canHeal) return false;
        
        // Check if doctor is trying to save themselves (only once per game)
        if (player.name === doctor.name && this.doctorHasSavedSelf) {
            return false; // Can't save self twice
        }
        
        // Track whether this heal actually saved someone from death
        let actuallyRevived = false;
        
        // Mark this player as protected
        // If they were killed by mafia, revive them
        if (player.killedBy === 'mafia' && !player.alive) {
            player.alive = true;
            player.savedByDoctor = true;
            this.revivedThisNight = player;
            actuallyRevived = true;
        } else {
            // Heal wasted - player wasn't killed
            // But still mark as "protected" for visual feedback
            player.savedByDoctor = true;
            this.revivedThisNight = null; // Don't set revivedThisNight for wasted heals
            actuallyRevived = false;
        }
        
        // Track if doctor saved themselves
        if (player.name === doctor.name) {
            this.doctorHasSavedSelf = true;
        }
        
        this.doctorActionTaken = true;
        this.lastAction = { 
            type: 'doctorHeal', 
            player: playerName,
            data: { actuallyRevived } // Track if this was a real revival or wasted heal
        };
        return true;
    }
    
    // Detective suspects someone
    detectiveSuspect(playerName) {
        const player = this.getPlayer(playerName);
        const detective = this.getPlayersByRole('detective')[0];
        
        // Can suspect alive OR newly dead players this night
        if (!player) return false;
        
        // Detective can't suspect themselves
        if (detective && player.name === detective.name) return false;
        
        // Only one action per turn
        if (this.detectiveActionTaken) return false;
        
        // Clear previous suspect indicator
        if (this.suspectedThisDay) {
            this.suspectedThisDay.wasSuspected = false;
        }
        
        player.wasSuspected = true;
        this.suspectedThisDay = player;
        
        // Check if detective found mafia - INSTANT WIN for villagers
        if (player.role === 'mafia') {
            this.gameOver = true;
            this.winner = 'villagers';
        }
        
        this.detectiveActionTaken = true;
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
        
        // If voted player was mafia, check win condition immediately
        // (might trigger villagers win)
        
        this.lastAction = { type: 'voteOut', player: playerName };
        return true;
    }
    
    // Undo last action
    undo() {
        if (!this.lastAction) return false;
        
        const { type, player: playerName, data } = this.lastAction;
        const player = this.getPlayer(playerName);
        
        switch (type) {
            case 'mafiaKill':
                player.alive = true;
                player.killedBy = null;
                this.killedThisNight = null;
                this.mafiaActionTaken = false;
                break;
                
            case 'doctorHeal':
                // Only kill the player if they were actually revived from death
                if (data && data.actuallyRevived) {
                    // Player was dead and revived - return them to dead state
                    player.alive = false;
                    player.killedBy = 'mafia';
                }
                // If it was a wasted heal, player stays alive (they were never dead)
                
                player.savedByDoctor = false;
                this.revivedThisNight = null;
                this.doctorActionTaken = false;
                
                // If undoing self-save, restore ability
                if (player.role === 'doctor') {
                    this.doctorHasSavedSelf = false;
                }
                break;
                
            case 'detectiveSuspect':
                player.wasSuspected = false;
                this.suspectedThisDay = null;
                this.detectiveActionTaken = false;
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
            this.doctorActionTaken = false; // Reset for doctor turn
        } else if (this.nightStep === 'doctor') {
            this.nightStep = 'detective';
            this.detectiveActionTaken = false; // Reset for detective turn
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
        
        // Reset action flags for new night
        this.mafiaActionTaken = false;
        this.doctorActionTaken = false;
        this.detectiveActionTaken = false;
        
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
            deadPlayers: this.players.filter(p => !p.alive).length,
            aliveMafia: this.getAliveMafia().length,
            gameOver: this.gameOver,
            winner: this.winner
        };
    }
}

export default MafiaGameState;
export { MafiaPlayer };