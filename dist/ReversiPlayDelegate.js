var ReversiPlayDelegateWrap;
(function (ReversiPlayDelegateWrap) {
    var FuncsJson = require("./FuncsJson");
    module.exports = (function () {
        function ReversiPlayDelegate(impl) {
            this.impl = impl;
        }
        ReversiPlayDelegate.prototype.viewMsgDlg = function (title, msg) {
            return this.impl.viewMsgDlg(title, msg);
        };
        ReversiPlayDelegate.prototype.drawSingle = function (y, x, sts, bk, text) {
            return this.impl.drawSingle(y, x, sts, bk, text);
        };
        ReversiPlayDelegate.prototype.curColMsg = function (text) {
            return this.impl.curColMsg(text);
        };
        ReversiPlayDelegate.prototype.curStsMsg = function (text) {
            return this.impl.curStsMsg(text);
        };
        ReversiPlayDelegate.prototype.wait = function (time) {
            return this.impl.wait(time);
        };
        return ReversiPlayDelegate;
    }());
})(ReversiPlayDelegateWrap || (ReversiPlayDelegateWrap = {}));
//# sourceMappingURL=ReversiPlayDelegate.js.map