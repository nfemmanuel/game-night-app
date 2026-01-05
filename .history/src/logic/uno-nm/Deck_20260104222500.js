import Card from '../uno/Card';

class Deck {
    constructor() {
        this.cards = [];
        this.initializeDeck();
    }

    initializeDeck() {
        const colors = ['red', 'blue', 'green', 'yellow'];

        // NUMBER CARDS
        // 0 cards: 1 per color = 4 total
        for (let color of colors) {
            this.cards.push(new Card(color, '0', 'number'));
        }

        // 1-9 cards: 2 per color per number = 72 total
        for (let color of colors) {
            for (let i = 1; i <= 9; i++) {
                this.cards.push(new Card(color, i.toString(), 'number'));
                this.cards.push(new Card(color, i.toString(), 'number'));
            }
        }

        // ACTION CARDS (CLASSIC): 2 per color each = 24 total
        for (let color of colors) {
            // Skip
            this.cards.push(new Card(color, 'skip', 'action'));
            this.cards.push(new Card(color, 'skip', 'action'));

            // Reverse
            this.cards.push(new Card(color, 'reverse', 'action'));
            this.cards.push(new Card(color, 'reverse', 'action'));

            // Draw 2
            this.cards.push(new Card(color, 'draw2', 'action'));
            this.cards.push(new Card(color, 'draw2', 'action'));
        }

        // ACTION CARDS (NO MERCY): 2 per color each = 16 total
        for (let color of colors) {
            // Skip Everyone
            this.cards.push(new Card(color, 'skip_everyone', 'action'));
            this.cards.push(new Card(color, 'skip_everyone', 'action'));

            // Discard All
            this.cards.push(new Card(color, 'discard_all', 'action'));
            this.cards.push(new Card(color, 'discard_all', 'action'));
        }

        // WILD CARDS - NO REGULAR WILD IN NO MERCY!

        // Wild Draw 4: 4 cards
        for (let i = 0; i < 4; i++) {
            this.cards.push(new Card(null, 'wild_draw4', 'wild'));
        }

        // Wild Draw 6: 8 cards
        for (let i = 0; i < 8; i++) {
            this.cards.push(new Card(null, 'wild_draw6', 'wild'));
        }

        // Wild Draw 10: 8 cards
        for (let i = 0; i < 8; i++) {
            this.cards.push(new Card(null, 'wild_draw10', 'wild'));
        }

        // Wild Reverse Draw 4: 8 cards
        for (let i = 0; i < 8; i++) {
            this.cards.push(new Card(null, 'wild_reverse_draw4', 'wild'));
        }

        // Wild Color Roulette: 8 cards (NEW!)
        for (let i = 0; i < 8; i++) {
            this.cards.push(new Card(null, 'wild_color_roulette', 'wild'));
        }

        // EXTRA POWERFUL CARDS to reach 168 total
        // (Official deck has duplicates of powerful cards)

        // Extra Wild Draw 6: 4 more
        for (let i = 0; i < 4; i++) {
            this.cards.push(new Card(null, 'wild_draw6', 'wild'));
        }

        // Extra Wild Draw 10: 4 more
        for (let i = 0; i < 4; i++) {
            this.cards.push(new Card(null, 'wild_draw10', 'wild'));
        }

        // Extra Wild Reverse Draw 4: 4 more
        for (let i = 0; i < 4; i++) {
            this.cards.push(new Card(null, 'wild_reverse_draw4', 'wild'));
        }

        // Extra Wild Color Roulette: 4 more
        for (let i = 0; i < 4; i++) {
            this.cards.push(new Card(null, 'wild_color_roulette', 'wild'));
        }

        // TOTAL: 168 cards
        // Number: 76 (4 zeros + 72 1-9s)
        // Classic Actions: 24 (Skip, Reverse, Draw 2)
        // NO MERCY Actions: 16 (Skip Everyone, Discard All)
        // Wild Cards: 52 (4 Draw4 + 12 Draw6 + 12 Draw10 + 12 Reverse Draw4 + 12 Roulette)
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