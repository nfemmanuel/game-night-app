import Card from './Card';

class Deck {
    constructor() {
        this.cards = [];
        this.initializeDeck();
    }

    initializeDeck() {
        const colors = ['red', 'yellow', 'green', 'blue'];

        // NUMBER CARDS (76 total)
        // Four 0s (one per color) = 4 cards
        colors.forEach(color => {
            this.cards.push(new Card(color, '0', 'number'));
        });

        // Two of each 1-9 per color = 72 cards
        for (let num = 1; num <= 9; num++) {
            colors.forEach(color => {
                this.cards.push(new Card(color, num.toString(), 'number'));
                this.cards.push(new Card(color, num.toString(), 'number'));
            });
        }

        // CLASSIC ACTION CARDS (24 total)
        // Skip, Reverse, Draw 2 - two per color
        const classicActions = ['skip', 'reverse', 'draw2'];
        classicActions.forEach(action => {
            colors.forEach(color => {
                this.cards.push(new Card(color, action, 'action'));
                this.cards.push(new Card(color, action, 'action'));
            });
        });

        // NO MERCY ACTION CARDS (16 total)
        // Skip Everyone, Discard All - two per color
        const noMercyActions = ['skip_everyone', 'discard_all'];
        noMercyActions.forEach(action => {
            colors.forEach(color => {
                this.cards.push(new Card(color, action, 'action'));
                this.cards.push(new Card(color, action, 'action'));
            });
        });

        // WILD CARDS (52 total)
        // NO regular Wild cards!
        // CRITICAL: NO Wild Draw 4! Only Wild REVERSE Draw 4!

        // Wild Reverse Draw 4 (16 cards = 4 + 12)
        // The 4 that would have been Wild Draw 4 + the 12 special ones
        for (let i = 0; i < 16; i++) {
            this.cards.push(new Card(null, 'wild_reverse_draw4', 'wild'));
        }

        // Wild Draw 6 (12 cards)
        for (let i = 0; i < 12; i++) {
            this.cards.push(new Card(null, 'wild_draw6', 'wild'));
        }

        // Wild Draw 10 (12 cards)
        for (let i = 0; i < 12; i++) {
            this.cards.push(new Card(null, 'wild_draw10', 'wild'));
        }

        // Wild Color Roulette (12 cards)
        for (let i = 0; i < 12; i++) {
            this.cards.push(new Card(null, 'wild_color_roulette', 'wild'));
        }

        // Total wild cards = 16 + 12 + 12 + 12 = 52
        // TOTAL DECK = 76 + 24 + 16 + 52 = 168 cards
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw() {
        return this.cards.pop();
    }
}

export default Deck;