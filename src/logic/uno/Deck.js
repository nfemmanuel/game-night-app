import Card from './Card';

class Deck {
    constructor() {
        this.cards = [];
        this.cardColors = ['red', 'yellow', 'green', 'blue'];
        this.actions = ['skip', 'draw2', 'reverse'];
        this.initializeDeck();
    }

    initializeDeck() {
        // Number cards
        for (let color of this.cardColors) {
            // One 0 per color
            this.cards.push(new Card(color, '0', 'number'));

            // Two of each 1-9 per color
            for (let num = 1; num <= 9; num++) {
                this.cards.push(new Card(color, num.toString(), 'number'));
                this.cards.push(new Card(color, num.toString(), 'number'));
            }
        }

        // Action cards
        for (let color of this.cardColors) {
            for (let action of this.actions) {
                this.cards.push(new Card(color, action, 'action'));
                this.cards.push(new Card(color, action, 'action'));
            }
        }

        // Wild cards
        for (let i = 0; i < 4; i++) {
            this.cards.push(new Card(null, 'wild', 'wild'));
            this.cards.push(new Card(null, 'wild_draw4', 'wild'));
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw() {
        if (this.cards.length === 0) {
            return null;
        }
        return this.cards.pop();
    }
}

export default Deck;