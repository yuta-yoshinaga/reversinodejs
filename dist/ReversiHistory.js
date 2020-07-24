module.exports = class ReversiHistory {
    constructor() {
        this.point = new ReversiPoint();
        this.reset();
    }
    reset() {
        this.point.x = -1;
        this.point.y = -1;
        this.color = -1;
    }
};
//# sourceMappingURL=ReversiHistory.js.map