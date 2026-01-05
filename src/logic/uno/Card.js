class Card {
    constructor(color, value, cardType) {
        this.color = color;
        this.value = value;
        this.card_type = cardType;
    }

    toString() {
        if (this.card_type === 'wild') {
            return `Wild: ${this.value}`;
        }
        return `${this.color} ${this.value}`;
    }
}

export default Card;