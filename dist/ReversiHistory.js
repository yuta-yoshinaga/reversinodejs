var ReversiPointWrap;
(function (ReversiPointWrap) {
    var ReversiPoint = require("./ReversiPoint");
    var ReversiHistory = (function () {
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
    ReversiPointWrap.ReversiHistory = ReversiHistory;
})(ReversiPointWrap || (ReversiPointWrap = {}));
//# sourceMappingURL=ReversiHistory.js.map