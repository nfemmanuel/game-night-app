import Card from '../uno/Card'; // Reuse the Card class

class Deck {
    constructor() {
        this.cards = [];
        this.initializeDeck();
    }

    initializeDeck() {
        const colors = ['red', 'blue', 'green', 'yellow'];

        // Number cards: 0-9 for each color
        // 0: 1 per color (4 total)
        // 1-9: 2 per color (72 total)
        for (let color of colors) {
            // One 0 per color
            this.cards.push(new Card(color, '0', 'number'));

            // Two of each 1-9 per color
            for (let i = 1; i <= 9; i++) {
                this.cards.push(new Card(color, i.toString(), 'number'));
                this.cards.push(new Card(color, i.toString(), 'number'));
            }
        }

        // Action cards: Skip, Reverse, Draw 2 (2 per color = 24 total)
        for (let color of colors) {
            this.cards.push(new Card(color, 'skip', 'action'));
            this.cards.push(new Card(color, 'skip', 'action'));

            this.cards.push(new Card(color, 'reverse', 'action'));
            this.cards.push(new Card(color, 'reverse', 'action'));

            this.cards.push(new Card(color, 'draw2', 'action'));
            this.cards.push(new Card(color, 'draw2', 'action'));
        }

        // NEW UNO-NM Action cards: Skip Everyone, Discard All (2 per color = 16 total)
        for (let color of colors) {
            this.cards.push(new Card(color, 'skip_everyone', 'action'));
            this.cards.push(new Card(color, 'skip_everyone', 'action'));

            this.cards.push(new Card(color, 'discard_all', 'action'));
            this.cards.push(new Card(color, 'discard_all', 'action'));
        }

        // Wild cards (4 of each type)
        // Regular Wild (4)
        for (let i = 0; i < 4; i++) {
            this.cards.push(new Card(null, 'wild', 'wild'));
        }

        // Wild Draw 4 (4)
        for (let i = 0; i < 4; i++) {
            this.cards.push(new Card(null, 'wild_draw4', 'wild'));
        }

        // NEW UNO-NM Wild cards
        // Wild Draw 6 (4)
        for (let i = 0; i < 4; i++) {
            this.cards.push(new Card(null, 'wild_draw6', 'wild'));
        }

        // Wild Draw 10 (4)
        for (let i = 0; i < 4; i++) {
            this.cards.push(new Card(null, 'wild_draw10', 'wild'));
        }

        // Wild Reverse Draw 4 (4)
        for (let i = 0; i < 4; i++) {
            this.cards.push(new Card(null, 'wild_reverse_draw4', 'wild'));
        }

        // Total: 76 (numbers) + 24 (regular actions) + 16 (NM actions) + 20 (wilds) = 136 cards
        // Note: Official UNO-NM has 168 cards, so they likely have more duplicates
        // Let's add more copies to reach ~168

        // Add extra copies of powerful cards
        for (let color of colors) {
            // Extra Skip Everyone (1 more per color = 4)
            this.cards.push(new Card(color, 'skip_everyone', 'action'));

            // Extra Discard All (1 more per color = 4)
            this.cards.push(new Card(color, 'discard_all', 'action'));

            // Extra Draw 2s (1 more per color = 4)
            this.cards.push(new Card(color, 'draw2', 'action'));
        }

        // Extra wild cards (4 more of each powerful type = 12)
        for (let i = 0; i < 4; i++) {
            this.cards.push(new Card(null, 'wild_draw6', 'wild'));
            this.cards.push(new Card(null, 'wild_draw10', 'wild'));
            this.cards.push(new Card(null, 'wild_reverse_draw4', 'wild'));
        }

        // Total now: 136 + 12 + 12 = 160 cards
        // Add 8 more regular wilds to reach 168
        for (let i = 0; i < 8; i++) {
            this.cards.push(new Card(null, 'wild', 'wild'));
        }

        console.log(`UNO-NM Deck initialized with ${this.cards.length} cards`);
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