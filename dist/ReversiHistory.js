var ReversiHistoryWrap;
(function (ReversiHistoryWrap) {
    var ReversiPoint = require("./ReversiPoint");
    module.exports = (function () {
        function ReversiHistory() {
            this.point = new ReversiPoint();
            this.reset();
        }
        ReversiHistory.prototype.reset = function () {
            this.point.x = -1;
            this.point.y = -1;
            this.color = -1;
        };
        return ReversiHistory;
    }());
})(ReversiHistoryWrap || (ReversiHistoryWrap = {}));
//# sourceMappingURL=ReversiHistory.js.map