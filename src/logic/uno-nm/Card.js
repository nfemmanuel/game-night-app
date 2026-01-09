class Card {
    constructor(color, value, card_type) {
        this.color = color;           // 'red', 'yellow', 'green', 'blue', or null (for wilds)
        this.value = value;           // '0'-'9', 'skip', 'reverse', 'draw2', 'wild_draw6', etc.
        this.card_type = card_type;   // 'number', 'action', or 'wild'
    }
    
    toString() {
        if (this.card_type === 'wild') {
            // Wild cards display
            if (this.value === 'wild_draw4') return 'Wild Draw 4';
            if (this.value === 'wild_draw6') return 'Wild Draw 6';
            if (this.value === 'wild_draw10') return 'Wild Draw 10';
            if (this.value === 'wild_reverse_draw4') return 'Wild Reverse Draw 4';
            if (this.value === 'wild_color_roulette') return 'Wild Color Roulette';
            return 'Wild';
        } else if (this.card_type === 'action') {
            // Action cards
            if (this.value === 'skip') return `${this.color} Skip`;
            if (this.value === 'reverse') return `${this.color} Reverse`;
            if (this.value === 'draw2') return `${this.color} Draw 2`;
            if (this.value === 'skip_everyone') return `${this.color} Skip Everyone`;
            if (this.value === 'discard_all') return `${this.color} Discard All`;
        } else {
            // Number cards
            return `${this.color} ${this.value}`;
        }
    }
}

export default Card;
