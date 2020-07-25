var ReversiPlayInterfaceImplWrap;
(function (ReversiPlayInterfaceImplWrap) {
    var FuncsJson = require("./FuncsJson");
    module.exports = (function () {
        function ReversiPlayInterfaceImpl() {
        }
        ReversiPlayInterfaceImpl.prototype.viewMsgDlg = function (title, msg) {
            var funcs = new FuncsJson();
            funcs.Function = "ViewMsgDlg";
            funcs.Param1 = title;
            funcs.Param2 = msg;
            return funcs;
        };
        ReversiPlayInterfaceImpl.prototype.drawSingle = function (y, x, sts, bk, text) {
            var funcs = new FuncsJson();
            funcs.Function = "DrawSingle";
            funcs.Param1 = String(y);
            funcs.Param2 = String(x);
            funcs.Param3 = String(sts);
            funcs.Param4 = String(bk);
            funcs.Param5 = text;
            return funcs;
        };
        ReversiPlayInterfaceImpl.prototype.curColMsg = function (text) {
            var funcs = new FuncsJson();
            funcs.Function = "CurColMsg";
            funcs.Param1 = text;
            return funcs;
        };
        ReversiPlayInterfaceImpl.prototype.curStsMsg = function (text) {
            var funcs = new FuncsJson();
            funcs.Function = "CurStsMsg";
            funcs.Param1 = text;
            return funcs;
        };
        ReversiPlayInterfaceImpl.prototype.wait = function (time) {
            var funcs = new FuncsJson();
            funcs.Function = "Wait";
            funcs.Param1 = String(time);
            return funcs;
        };
        return ReversiPlayInterfaceImpl;
    }());
})(ReversiPlayInterfaceImplWrap || (ReversiPlayInterfaceImplWrap = {}));
//# sourceMappingURL=ReversiPlayInterfaceImpl.js.map