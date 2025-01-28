export class Ship {
    constructor(size) {
        this.size = size;
        this.hits = 0;
        this.sunk = false;
    }

    hit() {
        this.hits++;
        if (this.hits === this.size) {
            this.sunk = true;
        }
    }

    isSunk() {
        return this.sunk;
    }
}