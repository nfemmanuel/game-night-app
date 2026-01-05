import Deck from './Deck';

class GameState {
    constructor(players) {
        this.players = players;
        this.deck = new Deck();
        this.deck.shuffle();
        this.discardPile = [];
        this.direction = 1; // 1 = clockwise, -1 = counterclockwise

        // Random starting player
        this.currentPlayerIndex = Math.floor(Math.random() * players.length);

        this.currentColor = null;

        // Deal 7 cards to each player
        this.dealInitialCards();

        // Start discard pile with number card
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
                // Put non-number card back and reshuffle
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

    canPlay(card) {
        const topCard = this.getTopCard();

        // Wild cards can always be played
        if (card.card_type === 'wild') {
            return true;
        }

        // Match current color
        if (card.color === this.currentColor) {
            return true;
        }

        // Match top card's value
        if (topCard && card.value === topCard.value) {
            return true;
        }

        return false;
    }

    playCard(player, card, chosenColor = null) {
        // Check if card is valid
        if (!this.canPlay(card)) {
            return false;
        }

        // Check if player has this card
        const cardIndex = player.hand.findIndex(c =>
            c.color === card.color &&
            c.value === card.value &&
            c.card_type === card.card_type
        );

        if (cardIndex === -1) {
            return false;
        }

        // Remove from hand and add to discard pile
        player.hand.splice(cardIndex, 1);
        this.discardPile.push(card);

        // Update current color
        if (card.card_type === 'wild') {
            if (chosenColor) {
                this.currentColor = chosenColor;
            } else {
                // Fallback: pick random color
                const colors = ['red', 'blue', 'green', 'yellow'];
                this.currentColor = colors[Math.floor(Math.random() * colors.length)];
            }
        } else {
            this.currentColor = card.color;
        }

        // Apply card effects
        this.applyCardEffect(card);

        return true;
    }

    applyCardEffect(card) {
        if (card.card_type === 'action') {
            if (card.value === 'skip') {
                // Skip next player by advancing turn
                this.nextTurn();
            }
            else if (card.value === 'reverse') {
                if (this.players.length > 2) {
                    // Reverse direction
                    this.direction *= -1;
                } else {
                    // In 2-player game, reverse acts like skip
                    this.nextTurn();
                }
            }
            else if (card.value === 'draw2') {
                // Next player draws 2 cards
                const nextPlayerIndex = (this.currentPlayerIndex + this.direction + this.players.length) % this.players.length;
                const nextPlayer = this.players[nextPlayerIndex];

                for (let i = 0; i < 2; i++) {
                    let drawnCard = this.deck.draw();
                    if (!drawnCard) {
                        this.reshuffleDiscard();
                        drawnCard = this.deck.draw();
                    }
                    if (drawnCard) {
                        nextPlayer.hand.push(drawnCard);
                    }
                }

                // Skip their turn
                this.nextTurn();
            }
        }
        else if (card.card_type === 'wild' && card.value === 'wild_draw4') {
            // Next player draws 4 cards
            const nextPlayerIndex = (this.currentPlayerIndex + this.direction + this.players.length) % this.players.length;
            const nextPlayer = this.players[nextPlayerIndex];

            for (let i = 0; i < 4; i++) {
                let drawnCard = this.deck.draw();
                if (!drawnCard) {
                    this.reshuffleDiscard();
                    drawnCard = this.deck.draw();
                }
                if (drawnCard) {
                    nextPlayer.hand.push(drawnCard);
                }
            }

            // Skip their turn
            this.nextTurn();
        }
    }

    nextTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + this.direction + this.players.length) % this.players.length;
    }

    reshuffleDiscard() {
        if (this.discardPile.length <= 1) {
            return; // Can't reshuffle if only top card remains
        }

        const topCard = this.discardPile[this.discardPile.length - 1]; // Keep top card
        this.deck.cards = this.discardPile.slice(0, -1); // Everything else goes back
        this.discardPile = [topCard];
        this.deck.shuffle();
    }

    checkWinner() {
        for (let player of this.players) {
            if (player.hand.length === 0) {
                return player;
            }
        }
        return null;
    }
}

export default GameState;