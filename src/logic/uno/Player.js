class Player {
    constructor(name, isHuman = false) {
        this.name = name;
        this.hand = [];
        this.isHuman = isHuman;
    }
}

export default Player;