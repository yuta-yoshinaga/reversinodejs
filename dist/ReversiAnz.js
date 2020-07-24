module.exports = class ReversiAnz {
    constructor() {
        this.reset();
    }
    reset() {
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
    }
};
//# sourceMappingURL=ReversiAnz.js.map