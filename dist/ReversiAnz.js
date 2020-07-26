module.exports = (function () {
    function ReversiAnz() {
        this.reset();
    }
    ReversiAnz.prototype.reset = function () {
        this.min = 0;
        this.max = 0;
        this.avg = 0.0;
        this.pointCnt = 0;
        this.edgeCnt = 0;
        this.edgeSideOneCnt = 0;
        this.edgeSideTwoCnt = 0;
        this.edgeSideThreeCnt = 0;
        this.edgeSideOtherCnt = 0;
        this.ownMin = 0;
        this.ownMax = 0;
        this.ownAvg = 0.0;
        this.ownPointCnt = 0;
        this.ownEdgeCnt = 0;
        this.ownEdgeSideOneCnt = 0;
        this.ownEdgeSideTwoCnt = 0;
        this.ownEdgeSideThreeCnt = 0;
        this.ownEdgeSideOtherCnt = 0;
        this.badPoint = 0;
        this.goodPoint = 0;
    };
    ReversiAnz.prototype.setSession = function (session) {
        this.min = session.min;
        this.max = session.max;
        this.avg = session.avg;
        this.pointCnt = session.pointCnt;
        this.edgeCnt = session.edgeCnt;
        this.edgeSideOneCnt = session.edgeSideOneCnt;
        this.edgeSideTwoCnt = session.edgeSideTwoCnt;
        this.edgeSideThreeCnt = session.edgeSideThreeCnt;
        this.edgeSideOtherCnt = session.edgeSideOtherCnt;
        this.ownMin = session.ownMin;
        this.ownMax = session.ownMax;
        this.ownAvg = session.ownAvg;
        this.ownPointCnt = session.ownPointCnt;
        this.ownEdgeCnt = session.ownEdgeCnt;
        this.ownEdgeSideOneCnt = session.ownEdgeSideOneCnt;
        this.ownEdgeSideTwoCnt = session.ownEdgeSideTwoCnt;
        this.ownEdgeSideThreeCnt = session.ownEdgeSideThreeCnt;
        this.ownEdgeSideOtherCnt = session.ownEdgeSideOtherCnt;
        this.badPoint = session.badPoint;
        this.goodPoint = session.goodPoint;
    };
    return ReversiAnz;
}());
//# sourceMappingURL=ReversiAnz.js.map