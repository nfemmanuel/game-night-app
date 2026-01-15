import Deck from './Deck';

class GameState {
    constructor(players) {
        this.players = players;
        this.deck = new Deck();
        this.deck.shuffle();
        this.discardPile = [];
        this.direction = 1;
        this.currentPlayerIndex = Math.floor(Math.random() * players.length);
        this.currentColor = null;
        this.stackedDrawCount = 0;
        this.isStacking = false;
        this.rouletteActive = false;
        this.dealInitialCards();
        this.startDiscardPile();
    }

    dealInitialCards() {
        for (let player of this.players) {
            for (let i = 0; i < 7; i++) {
                const card = this.deck.draw();
                if (card) {
                    player.hand.push(card);
                }
            }
        }
    }

    startDiscardPile() {
        while (true) {
            const card = this.deck.draw();
            if (card && card.card_type === 'number') {
                this.discardPile.push(card);
                this.currentColor = card.color;
                break;
            } else if (card) {
                this.deck.cards.push(card);
                this.deck.shuffle();
            }
        }
    }

    getTopCard() {
        if (this.discardPile.length === 0) {
            return null;
        }
        return this.discardPile[this.discardPile.length - 1];
    }

    // FIXED: Correct canPlay logic
    canPlay(card) {
        // When stacking, ONLY allow stackable draw cards
        if (this.isStacking) {
            return this.isStackableDrawCard(card) &&
                this.getDrawValue(card) >= this.getDrawValue(this.getTopCard());
        }

        // When NOT stacking, normal UNO rules:
        const topCard = this.getTopCard();

        // Wild cards are ALWAYS playable
        if (card.card_type === 'wild') {
            return true;
        }

        // Cards matching the current color are playable
        if (card.color === this.currentColor) {
            return true;
        }

        // Cards matching the top card's value are playable
        if (topCard && card.value === topCard.value) {
            return true;
        }

        return false;
    }

    // FIXED: Includes wild_reverse_draw4, excludes wild_draw4
    isStackableDrawCard(card) {
        const drawCards = ['draw2', 'wild_draw6', 'wild_draw10', 'wild_reverse_draw4'];
        if (card.card_type === 'action' && card.value === 'draw2') return true;
        if (card.card_type === 'wild' && drawCards.includes(card.value)) return true;
        // wild_color_roulette is NOT stackable!
        return false;
    }

    getDrawValue(card) {
        if (!card) return 0;
        if (card.value === 'draw2') return 2;
        if (card.value === 'wild_draw6') return 6;
        if (card.value === 'wild_draw10') return 10;
        if (card.value === 'wild_reverse_draw4') return 4;
        return 0;
    }

    playCard(player, card, chosenColor = null) {
        if (!this.canPlay(card)) {
            return false;
        }

        const cardIndex = player.hand.findIndex(c =>
            c.color === card.color &&
            c.value === card.value &&
            c.card_type === card.card_type
        );

        if (cardIndex === -1) {
            return false;
        }

        player.hand.splice(cardIndex, 1);
        this.discardPile.push(card);

        // FIXED: Set color for wild cards (except Wild Color Roulette)
        if (card.card_type === 'wild' &&/* card.value !== 'wild_color_roulette' */) {
            if (chosenColor) {
                this.currentColor = chosenColor;
            } else {
                const colors = ['red', 'blue', 'green', 'yellow'];
                this.currentColor = colors[Math.floor(Math.random() * colors.length)];
            }
        } else if (card.card_type === 'wild' && card.value === 'wild_color_roulette') {
            // FIXED: Don't set color for roulette - next player will choose it
            // Keep current color for now
        } else {
            this.currentColor = card.color;
        }

        // Handle stacking
        if (this.isStacking && this.isStackableDrawCard(card)) {
            this.stackedDrawCount += this.getDrawValue(card);
            this.nextTurn();
            return true;
        }

        this.applyCardEffect(card);

        return true;
    }

    applyCardEffect(card) {
        if (card.card_type === 'action') {
            if (card.value === 'skip') {
                this.nextTurn();
            }
            else if (card.value === 'skip_everyone') {
                // Current player plays again
            }
            else if (card.value === 'reverse') {
                if (this.players.length > 2) {
                    this.direction *= -1;
                } else {
                    this.nextTurn();
                }
            }
            else if (card.value === 'draw2') {
                this.isStacking = true;
                this.stackedDrawCount = 2;
                this.nextTurn();
            }
        }
        else if (card.card_type === 'wild') {
            if (card.value === 'wild_draw6') {
                this.isStacking = true;
                this.stackedDrawCount = 6;
                this.nextTurn();
            }
            else if (card.value === 'wild_draw10') {
                this.isStacking = true;
                this.stackedDrawCount = 10;
                this.nextTurn();
            }
            // FIXED: Wild Reverse +4 acts like regular Wild +4 in 2-player games
            else if (card.value === 'wild_reverse_draw4') {
                // Only reverse if 3+ players
                if (this.players.length > 2) {
                    this.direction *= -1;
                }
                // In 2-player games, skip the reversal (acts like Wild +4)

                this.isStacking = true;
                this.stackedDrawCount = 4;
                this.nextTurn();
            }
            else if (card.value === 'wild_color_roulette') {
                this.rouletteActive = true;
                this.nextTurn();
            }
        }
        else if (card.card_type === 'number') {
            if (card.value === '0') {
                this.rotateHands();
            }
        }
    }

    // FIXED: Completely resets stacking mode
    executeStackedDraw() {
        const currentPlayer = this.players[this.currentPlayerIndex];

        for (let i = 0; i < this.stackedDrawCount; i++) {
            let card = this.deck.draw();
            if (!card) {
                this.reshuffleDiscard();
                card = this.deck.draw();
            }
            if (card) {
                currentPlayer.hand.push(card);
            }
        }

        this.checkMercyRule(currentPlayer);

        // FIXED: Complete reset of stacking mode
        this.isStacking = false;
        this.stackedDrawCount = 0;

        this.nextTurn();
    }

    rotateHands() {
        if (this.players.length < 2) return;

        const hands = this.players.map(p => p.hand);

        if (this.direction === 1) {
            const lastHand = hands[hands.length - 1];
            for (let i = hands.length - 1; i > 0; i--) {
                this.players[i].hand = hands[i - 1];
            }
            this.players[0].hand = lastHand;
        } else {
            const firstHand = hands[0];
            for (let i = 0; i < hands.length - 1; i++) {
                this.players[i].hand = hands[i + 1];
            }
            this.players[hands.length - 1].hand = firstHand;
        }
    }

    swapHands(player1Index, player2Index) {
        const temp = this.players[player1Index].hand;
        this.players[player1Index].hand = this.players[player2Index].hand;
        this.players[player2Index].hand = temp;
    }

    // FIXED: Sets currentColor to the chosen color
    drawUntilColor(player, chosenColor) {
        const drawnCards = [];
        let foundMatch = false;

        while (!foundMatch) {
            let card = this.deck.draw();
            if (!card) {
                this.reshuffleDiscard();
                card = this.deck.draw();
            }

            if (!card) break;

            player.hand.push(card);
            drawnCards.push(card);

            // Wild cards don't count as matching!
            if (card.color === chosenColor) {
                foundMatch = true;
            }
        }

        this.checkMercyRule(player);

        // FIXED: Set the discard pile color to what the player chose
        this.currentColor = chosenColor;

        return drawnCards;
    }

    drawUntilPlayable(player) {
        const drawnCards = [];

        while (true) {
            let card = this.deck.draw();
            if (!card) {
                this.reshuffleDiscard();
                card = this.deck.draw();
            }

            if (!card) break;

            player.hand.push(card);
            drawnCards.push(card);

            if (this.canPlay(card)) {
                break;
            }
        }

        this.checkMercyRule(player);

        return drawnCards;
    }

    discardAllColor(player, color) {
        const cardsToDiscard = player.hand.filter(card => card.color === color);
        const discardCount = cardsToDiscard.length;

        player.hand = player.hand.filter(card => card.color !== color);

        return discardCount;
    }

    checkMercyRule(player) {
        if (player.hand.length >= 25) {
            player.isEliminated = true;
            player.hand = [];
            return true;
        }
        return false;
    }

    nextTurn() {
        do {
            this.currentPlayerIndex = (this.currentPlayerIndex + this.direction + this.players.length) % this.players.length;
        } while (this.players[this.currentPlayerIndex].isEliminated && this.getActivePlayers().length > 1);
    }

    reshuffleDiscard() {
        if (this.discardPile.length <= 1) {
            return;
        }

        const topCard = this.discardPile[this.discardPile.length - 1];
        this.deck.cards = this.discardPile.slice(0, -1);
        this.discardPile = [topCard];
        this.deck.shuffle();
    }

    getActivePlayers() {
        return this.players.filter(p => !p.isEliminated);
    }

    // FIXED: Two-player elimination win detection
    checkWinner() {
        const activePlayers = this.getActivePlayers();

        // Win condition 1: Empty hand
        for (let player of activePlayers) {
            if (player.hand.length === 0) {
                return player;
            }
        }

        // Win condition 2: Last player standing
        if (activePlayers.length === 1) {
            return activePlayers[0];
        }

        // FIXED: Redundant check for edge cases
        const nonEliminatedCount = this.players.filter(p => !p.isEliminated).length;
        if (nonEliminatedCount === 1) {
            return this.players.find(p => !p.isEliminated);
        }

        return null;
    }
}

export default GameState;