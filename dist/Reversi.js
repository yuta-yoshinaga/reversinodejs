var ReversiWrap;
(function (ReversiWrap) {
    var extend = require("extend");
    var ReversiAnz = require("./ReversiAnz");
    var ReversiPoint = require("./ReversiPoint");
    var ReversiHistory = require("./ReversiHistory");
    var ReversiConst = require("./ReversiConst");
    module.exports = (function () {
        function Reversi(masuCnt, masuMax) {
            this.mMasuCnt = masuCnt;
            this.mMasuCntMax = masuMax;
            this.mMasuSts = new Array();
            this.mMasuStsEnaB = new Array();
            this.mMasuStsCntB = new Array();
            this.mMasuStsPassB = new Array();
            this.mMasuStsAnzB = new Array();
            this.mMasuStsEnaW = new Array();
            this.mMasuStsCntW = new Array();
            this.mMasuStsPassW = new Array();
            this.mMasuStsAnzW = new Array();
            for (var i = 0; i < this.mMasuCntMax; i++) {
                this.mMasuSts[i] = new Array();
                this.mMasuStsEnaB[i] = new Array();
                this.mMasuStsCntB[i] = new Array();
                this.mMasuStsPassB[i] = new Array();
                this.mMasuStsAnzB[i] = new Array();
                this.mMasuStsEnaW[i] = new Array();
                this.mMasuStsCntW[i] = new Array();
                this.mMasuStsPassW[i] = new Array();
                this.mMasuStsAnzW[i] = new Array();
                for (var j = 0; j < this.mMasuCntMax; j++) {
                    this.mMasuSts[i][j] = ReversiConst.REVERSI_STS_NONE;
                    this.mMasuStsEnaB[i][j] = ReversiConst.REVERSI_STS_NONE;
                    this.mMasuStsCntB[i][j] = ReversiConst.REVERSI_STS_NONE;
                    this.mMasuStsPassB[i][j] = ReversiConst.REVERSI_STS_NONE;
                    this.mMasuStsAnzB[i][j] = new ReversiAnz();
                    this.mMasuStsEnaW[i][j] = ReversiConst.REVERSI_STS_NONE;
                    this.mMasuStsCntW[i][j] = ReversiConst.REVERSI_STS_NONE;
                    this.mMasuStsPassW[i][j] = ReversiConst.REVERSI_STS_NONE;
                    this.mMasuStsAnzW[i][j] = new ReversiAnz();
                }
            }
            this.mMasuPointB = new Array();
            this.mMasuPointW = new Array();
            for (var i = 0; i < this.mMasuCntMax * this.mMasuCntMax; i++) {
                this.mMasuPointB[i] = new ReversiPoint();
                this.mMasuPointW[i] = new ReversiPoint();
            }
            this.mMasuPointCntB = 0;
            this.mMasuPointCntW = 0;
            this.mMasuBetCntB = 0;
            this.mMasuBetCntW = 0;
            this.mMasuHist = new Array();
            for (var i = 0; i < this.mMasuCntMax * this.mMasuCntMax; i++) {
                this.mMasuHist[i] = new ReversiHistory();
            }
            this.mMasuHistCur = 0;
            this.mMasuStsOld = extend(true, [], this.mMasuSts);
            this.reset();
        }
        Reversi.prototype.reset = function () {
            for (var i = 0; i < this.mMasuCnt; i++) {
                for (var j = 0; j < this.mMasuCnt; j++) {
                    this.mMasuSts[i][j] = ReversiConst.REVERSI_STS_NONE;
                    this.mMasuStsPassB[i][j] = 0;
                    this.mMasuStsAnzB[i][j].reset();
                    this.mMasuStsPassW[i][j] = 0;
                    this.mMasuStsAnzW[i][j].reset();
                }
            }
            var idx1 = (this.mMasuCnt >> 1) - 1;
            var idx2 = this.mMasuCnt >> 1;
            this.mMasuSts[idx1][idx1] = ReversiConst.REVERSI_STS_BLACK;
            this.mMasuSts[idx1][idx2] = ReversiConst.REVERSI_STS_WHITE;
            this.mMasuSts[idx2][idx1] = ReversiConst.REVERSI_STS_WHITE;
            this.mMasuSts[idx2][idx2] = ReversiConst.REVERSI_STS_BLACK;
            this.makeMasuSts(ReversiConst.REVERSI_STS_BLACK);
            this.makeMasuSts(ReversiConst.REVERSI_STS_WHITE);
            this.mMasuHistCur = 0;
            this.mMasuStsOld = extend(true, [], this.mMasuSts);
        };
        Reversi.prototype.makeMasuSts = function (color) {
            var flg;
            var okflg = 0;
            var cnt1;
            var cnt2;
            var count1;
            var count2 = 0;
            var ret = -1;
            var countMax = 0;
            var loop;
            for (var i = 0; i < this.mMasuCnt; i++) {
                for (var j = 0; j < this.mMasuCnt; j++) {
                    if (color == ReversiConst.REVERSI_STS_BLACK) {
                        this.mMasuStsEnaB[i][j] = 0;
                        this.mMasuStsCntB[i][j] = 0;
                    }
                    else {
                        this.mMasuStsEnaW[i][j] = 0;
                        this.mMasuStsCntW[i][j] = 0;
                    }
                }
            }
            loop = this.mMasuCnt * this.mMasuCnt;
            for (var i = 0; i < loop; i++) {
                if (color == ReversiConst.REVERSI_STS_BLACK) {
                    this.mMasuPointB[i].x = 0;
                    this.mMasuPointB[i].y = 0;
                }
                else {
                    this.mMasuPointW[i].x = 0;
                    this.mMasuPointW[i].y = 0;
                }
            }
            if (color == ReversiConst.REVERSI_STS_BLACK) {
                this.mMasuPointCntB = 0;
            }
            else {
                this.mMasuPointCntW = 0;
            }
            this.mMasuBetCntB = 0;
            this.mMasuBetCntW = 0;
            for (var i = 0; i < this.mMasuCnt; i++) {
                for (var j = 0; j < this.mMasuCnt; j++) {
                    okflg = 0;
                    count2 = 0;
                    if (this.mMasuSts[i][j] == ReversiConst.REVERSI_STS_NONE) {
                        cnt1 = i;
                        count1 = flg = 0;
                        while (cnt1 > 0 &&
                            this.mMasuSts[cnt1 - 1][j] != ReversiConst.REVERSI_STS_NONE &&
                            this.mMasuSts[cnt1 - 1][j] != color) {
                            flg = 1;
                            cnt1--;
                            count1++;
                        }
                        if (cnt1 > 0 && flg == 1 && this.mMasuSts[cnt1 - 1][j] == color) {
                            okflg = 1;
                            count2 += count1;
                        }
                        cnt1 = i;
                        count1 = flg = 0;
                        while (cnt1 < this.mMasuCnt - 1 &&
                            this.mMasuSts[cnt1 + 1][j] != ReversiConst.REVERSI_STS_NONE &&
                            this.mMasuSts[cnt1 + 1][j] != color) {
                            flg = 1;
                            cnt1++;
                            count1++;
                        }
                        if (cnt1 < this.mMasuCnt - 1 &&
                            flg == 1 &&
                            this.mMasuSts[cnt1 + 1][j] == color) {
                            okflg = 1;
                            count2 += count1;
                        }
                        cnt2 = j;
                        count1 = flg = 0;
                        while (cnt2 < this.mMasuCnt - 1 &&
                            this.mMasuSts[i][cnt2 + 1] != ReversiConst.REVERSI_STS_NONE &&
                            this.mMasuSts[i][cnt2 + 1] != color) {
                            flg = 1;
                            cnt2++;
                            count1++;
                        }
                        if (cnt2 < this.mMasuCnt - 1 &&
                            flg == 1 &&
                            this.mMasuSts[i][cnt2 + 1] == color) {
                            okflg = 1;
                            count2 += count1;
                        }
                        cnt2 = j;
                        count1 = flg = 0;
                        while (cnt2 > 0 &&
                            this.mMasuSts[i][cnt2 - 1] != ReversiConst.REVERSI_STS_NONE &&
                            this.mMasuSts[i][cnt2 - 1] != color) {
                            flg = 1;
                            cnt2--;
                            count1++;
                        }
                        if (cnt2 > 0 && flg == 1 && this.mMasuSts[i][cnt2 - 1] == color) {
                            okflg = 1;
                            count2 += count1;
                        }
                        cnt2 = j;
                        cnt1 = i;
                        count1 = flg = 0;
                        while (cnt2 < this.mMasuCnt - 1 &&
                            cnt1 > 0 &&
                            this.mMasuSts[cnt1 - 1][cnt2 + 1] !=
                                ReversiConst.REVERSI_STS_NONE &&
                            this.mMasuSts[cnt1 - 1][cnt2 + 1] != color) {
                            flg = 1;
                            cnt1--;
                            cnt2++;
                            count1++;
                        }
                        if (cnt2 < this.mMasuCnt - 1 &&
                            cnt1 > 0 &&
                            flg == 1 &&
                            this.mMasuSts[cnt1 - 1][cnt2 + 1] == color) {
                            okflg = 1;
                            count2 += count1;
                        }
                        cnt2 = j;
                        cnt1 = i;
                        count1 = flg = 0;
                        while (cnt2 > 0 &&
                            cnt1 > 0 &&
                            this.mMasuSts[cnt1 - 1][cnt2 - 1] !=
                                ReversiConst.REVERSI_STS_NONE &&
                            this.mMasuSts[cnt1 - 1][cnt2 - 1] != color) {
                            flg = 1;
                            cnt1--;
                            cnt2--;
                            count1++;
                        }
                        if (cnt2 > 0 &&
                            cnt1 > 0 &&
                            flg == 1 &&
                            this.mMasuSts[cnt1 - 1][cnt2 - 1] == color) {
                            okflg = 1;
                            count2 += count1;
                        }
                        cnt2 = j;
                        cnt1 = i;
                        count1 = flg = 0;
                        while (cnt2 < this.mMasuCnt - 1 &&
                            cnt1 < this.mMasuCnt - 1 &&
                            this.mMasuSts[cnt1 + 1][cnt2 + 1] !=
                                ReversiConst.REVERSI_STS_NONE &&
                            this.mMasuSts[cnt1 + 1][cnt2 + 1] != color) {
                            flg = 1;
                            cnt1++;
                            cnt2++;
                            count1++;
                        }
                        if (cnt2 < this.mMasuCnt - 1 &&
                            cnt1 < this.mMasuCnt - 1 &&
                            flg == 1 &&
                            this.mMasuSts[cnt1 + 1][cnt2 + 1] == color) {
                            okflg = 1;
                            count2 += count1;
                        }
                        cnt2 = j;
                        cnt1 = i;
                        count1 = flg = 0;
                        while (cnt2 > 0 &&
                            cnt1 < this.mMasuCnt - 1 &&
                            this.mMasuSts[cnt1 + 1][cnt2 - 1] !=
                                ReversiConst.REVERSI_STS_NONE &&
                            this.mMasuSts[cnt1 + 1][cnt2 - 1] != color) {
                            flg = 1;
                            cnt1++;
                            cnt2--;
                            count1++;
                        }
                        if (cnt2 > 0 &&
                            cnt1 < this.mMasuCnt - 1 &&
                            flg == 1 &&
                            this.mMasuSts[cnt1 + 1][cnt2 - 1] == color) {
                            okflg = 1;
                            count2 += count1;
                        }
                        if (okflg == 1) {
                            if (color == ReversiConst.REVERSI_STS_BLACK) {
                                this.mMasuStsEnaB[i][j] = 1;
                                this.mMasuStsCntB[i][j] = count2;
                                this.mMasuPointB[this.mMasuPointCntB].y = i;
                                this.mMasuPointB[this.mMasuPointCntB].x = j;
                                this.mMasuPointCntB++;
                            }
                            else {
                                this.mMasuStsEnaW[i][j] = 1;
                                this.mMasuStsCntW[i][j] = count2;
                                this.mMasuPointW[this.mMasuPointCntW].y = i;
                                this.mMasuPointW[this.mMasuPointCntW].x = j;
                                this.mMasuPointCntW++;
                            }
                            ret = 0;
                            if (countMax < count2)
                                countMax = count2;
                        }
                    }
                    else if (this.mMasuSts[i][j] == ReversiConst.REVERSI_STS_BLACK) {
                        this.mMasuBetCntB++;
                    }
                    else if (this.mMasuSts[i][j] == ReversiConst.REVERSI_STS_WHITE) {
                        this.mMasuBetCntW++;
                    }
                }
            }
            for (var i = 0; i < this.mMasuCnt; i++) {
                for (var j = 0; j < this.mMasuCnt; j++) {
                    if (color == ReversiConst.REVERSI_STS_BLACK) {
                        if (this.mMasuStsEnaB[i][j] != 0 &&
                            this.mMasuStsCntB[i][j] == countMax) {
                            this.mMasuStsEnaB[i][j] = 2;
                        }
                    }
                    else {
                        if (this.mMasuStsEnaW[i][j] != 0 &&
                            this.mMasuStsCntW[i][j] == countMax) {
                            this.mMasuStsEnaW[i][j] = 2;
                        }
                    }
                }
            }
            return ret;
        };
        Reversi.prototype.revMasuSts = function (color, y, x) {
            var cnt1;
            var cnt2;
            var rcnt1;
            var rcnt2;
            var flg = 0;
            for (flg = 0, cnt1 = x, cnt2 = y; cnt1 > 0;) {
                if (this.mMasuSts[cnt2][cnt1 - 1] != ReversiConst.REVERSI_STS_NONE &&
                    this.mMasuSts[cnt2][cnt1 - 1] != color) {
                    cnt1--;
                }
                else if (this.mMasuSts[cnt2][cnt1 - 1] == color) {
                    flg = 1;
                    break;
                }
                else if (this.mMasuSts[cnt2][cnt1 - 1] == ReversiConst.REVERSI_STS_NONE) {
                    break;
                }
            }
            if (flg == 1) {
                for (rcnt1 = cnt1; rcnt1 < x; rcnt1++) {
                    this.mMasuSts[cnt2][rcnt1] = color;
                }
            }
            for (flg = 0, cnt1 = x, cnt2 = y; cnt1 < this.mMasuCnt - 1;) {
                if (this.mMasuSts[cnt2][cnt1 + 1] != ReversiConst.REVERSI_STS_NONE &&
                    this.mMasuSts[cnt2][cnt1 + 1] != color) {
                    cnt1++;
                }
                else if (this.mMasuSts[cnt2][cnt1 + 1] == color) {
                    flg = 1;
                    break;
                }
                else if (this.mMasuSts[cnt2][cnt1 + 1] == ReversiConst.REVERSI_STS_NONE) {
                    break;
                }
            }
            if (flg == 1) {
                for (rcnt1 = cnt1; rcnt1 > x; rcnt1--) {
                    this.mMasuSts[cnt2][rcnt1] = color;
                }
            }
            for (flg = 0, cnt1 = x, cnt2 = y; cnt2 > 0;) {
                if (this.mMasuSts[cnt2 - 1][cnt1] != ReversiConst.REVERSI_STS_NONE &&
                    this.mMasuSts[cnt2 - 1][cnt1] != color) {
                    cnt2--;
                }
                else if (this.mMasuSts[cnt2 - 1][cnt1] == color) {
                    flg = 1;
                    break;
                }
                else if (this.mMasuSts[cnt2 - 1][cnt1] == ReversiConst.REVERSI_STS_NONE) {
                    break;
                }
            }
            if (flg == 1) {
                for (rcnt1 = cnt2; rcnt1 < y; rcnt1++) {
                    this.mMasuSts[rcnt1][cnt1] = color;
                }
            }
            for (flg = 0, cnt1 = x, cnt2 = y; cnt2 < this.mMasuCnt - 1;) {
                if (this.mMasuSts[cnt2 + 1][cnt1] != ReversiConst.REVERSI_STS_NONE &&
                    this.mMasuSts[cnt2 + 1][cnt1] != color) {
                    cnt2++;
                }
                else if (this.mMasuSts[cnt2 + 1][cnt1] == color) {
                    flg = 1;
                    break;
                }
                else if (this.mMasuSts[cnt2 + 1][cnt1] == ReversiConst.REVERSI_STS_NONE) {
                    break;
                }
            }
            if (flg == 1) {
                for (rcnt1 = cnt2; rcnt1 > y; rcnt1--) {
                    this.mMasuSts[rcnt1][cnt1] = color;
                }
            }
            for (flg = 0, cnt1 = x, cnt2 = y; cnt2 > 0 && cnt1 > 0;) {
                if (this.mMasuSts[cnt2 - 1][cnt1 - 1] != ReversiConst.REVERSI_STS_NONE &&
                    this.mMasuSts[cnt2 - 1][cnt1 - 1] != color) {
                    cnt2--;
                    cnt1--;
                }
                else if (this.mMasuSts[cnt2 - 1][cnt1 - 1] == color) {
                    flg = 1;
                    break;
                }
                else if (this.mMasuSts[cnt2 - 1][cnt1 - 1] == ReversiConst.REVERSI_STS_NONE) {
                    break;
                }
            }
            if (flg == 1) {
                for (rcnt1 = cnt2, rcnt2 = cnt1; rcnt1 < y && rcnt2 < x; rcnt1++, rcnt2++) {
                    this.mMasuSts[rcnt1][rcnt2] = color;
                }
            }
            for (flg = 0, cnt1 = x, cnt2 = y; cnt2 < this.mMasuCnt - 1 && cnt1 > 0;) {
                if (this.mMasuSts[cnt2 + 1][cnt1 - 1] != ReversiConst.REVERSI_STS_NONE &&
                    this.mMasuSts[cnt2 + 1][cnt1 - 1] != color) {
                    cnt2++;
                    cnt1--;
                }
                else if (this.mMasuSts[cnt2 + 1][cnt1 - 1] == color) {
                    flg = 1;
                    break;
                }
                else if (this.mMasuSts[cnt2 + 1][cnt1 - 1] == ReversiConst.REVERSI_STS_NONE) {
                    break;
                }
            }
            if (flg == 1) {
                for (rcnt1 = cnt2, rcnt2 = cnt1; rcnt1 > y && rcnt2 < x; rcnt1--, rcnt2++) {
                    this.mMasuSts[rcnt1][rcnt2] = color;
                }
            }
            for (flg = 0, cnt1 = x, cnt2 = y; cnt2 > 0 && cnt1 < this.mMasuCnt - 1;) {
                if (this.mMasuSts[cnt2 - 1][cnt1 + 1] != ReversiConst.REVERSI_STS_NONE &&
                    this.mMasuSts[cnt2 - 1][cnt1 + 1] != color) {
                    cnt2--;
                    cnt1++;
                }
                else if (this.mMasuSts[cnt2 - 1][cnt1 + 1] == color) {
                    flg = 1;
                    break;
                }
                else if (this.mMasuSts[cnt2 - 1][cnt1 + 1] == ReversiConst.REVERSI_STS_NONE) {
                    break;
                }
            }
            if (flg == 1) {
                for (rcnt1 = cnt2, rcnt2 = cnt1; rcnt1 < y && rcnt2 > x; rcnt1++, rcnt2--) {
                    this.mMasuSts[rcnt1][rcnt2] = color;
                }
            }
            for (flg = 0, cnt1 = x, cnt2 = y; cnt2 < this.mMasuCnt - 1 && cnt1 < this.mMasuCnt - 1;) {
                if (this.mMasuSts[cnt2 + 1][cnt1 + 1] != ReversiConst.REVERSI_STS_NONE &&
                    this.mMasuSts[cnt2 + 1][cnt1 + 1] != color) {
                    cnt2++;
                    cnt1++;
                }
                else if (this.mMasuSts[cnt2 + 1][cnt1 + 1] == color) {
                    flg = 1;
                    break;
                }
                else if (this.mMasuSts[cnt2 + 1][cnt1 + 1] == ReversiConst.REVERSI_STS_NONE) {
                    break;
                }
            }
            if (flg == 1) {
                for (rcnt1 = cnt2, rcnt2 = cnt1; rcnt1 > y && rcnt2 > x; rcnt1--, rcnt2--) {
                    this.mMasuSts[rcnt1][rcnt2] = color;
                }
            }
        };
        Reversi.prototype.checkPara = function (para, min, max) {
            var ret = -1;
            if (min <= para && para <= max)
                ret = 0;
            return ret;
        };
        Reversi.prototype.AnalysisReversiBlack = function () {
            var tmpX;
            var tmpY;
            var sum;
            var sumOwn;
            var tmpGoodPoint;
            var tmpBadPoint;
            var tmpD1;
            var tmpD2;
            for (var cnt = 0; cnt < this.mMasuPointCntB; cnt++) {
                var tmpMasu = extend(true, [], this.mMasuSts);
                var tmpMasuEnaB = extend(true, [], this.mMasuStsEnaB);
                var tmpMasuEnaW = extend(true, [], this.mMasuStsEnaW);
                tmpY = this.mMasuPointB[cnt].y;
                tmpX = this.mMasuPointB[cnt].x;
                this.mMasuSts[tmpY][tmpX] = ReversiConst.REVERSI_STS_BLACK;
                this.revMasuSts(ReversiConst.REVERSI_STS_BLACK, tmpY, tmpX);
                this.makeMasuSts(ReversiConst.REVERSI_STS_BLACK);
                this.makeMasuSts(ReversiConst.REVERSI_STS_WHITE);
                if (this.getColorEna(ReversiConst.REVERSI_STS_WHITE) != 0) {
                    this.mMasuStsPassB[tmpY][tmpX] = 1;
                }
                if (this.getEdgeSideZero(tmpY, tmpX) == 0) {
                    this.mMasuStsAnzB[tmpY][tmpX].ownEdgeCnt++;
                    this.mMasuStsAnzB[tmpY][tmpX].goodPoint +=
                        10000 * this.mMasuStsCntB[tmpY][tmpX];
                }
                else if (this.getEdgeSideOne(tmpY, tmpX) == 0) {
                    this.mMasuStsAnzB[tmpY][tmpX].ownEdgeSideOneCnt++;
                    if (this.checkEdge(ReversiConst.REVERSI_STS_BLACK, tmpY, tmpX) != 0) {
                        this.mMasuStsAnzB[tmpY][tmpX].goodPoint +=
                            10 * this.mMasuStsCntB[tmpY][tmpX];
                    }
                    else {
                        this.mMasuStsAnzB[tmpY][tmpX].badPoint += 100000;
                    }
                }
                else if (this.getEdgeSideTwo(tmpY, tmpX) == 0) {
                    this.mMasuStsAnzB[tmpY][tmpX].ownEdgeSideTwoCnt++;
                    this.mMasuStsAnzB[tmpY][tmpX].goodPoint +=
                        1000 * this.mMasuStsCntB[tmpY][tmpX];
                }
                else if (this.getEdgeSideThree(tmpY, tmpX) == 0) {
                    this.mMasuStsAnzB[tmpY][tmpX].ownEdgeSideThreeCnt++;
                    this.mMasuStsAnzB[tmpY][tmpX].goodPoint +=
                        100 * this.mMasuStsCntB[tmpY][tmpX];
                }
                else {
                    this.mMasuStsAnzB[tmpY][tmpX].ownEdgeSideOtherCnt++;
                    this.mMasuStsAnzB[tmpY][tmpX].goodPoint +=
                        10 * this.mMasuStsCntB[tmpY][tmpX];
                }
                sum = 0;
                sumOwn = 0;
                for (var i = 0; i < this.mMasuCnt; i++) {
                    for (var j = 0; j < this.mMasuCnt; j++) {
                        tmpBadPoint = 0;
                        tmpGoodPoint = 0;
                        if (this.getMasuStsEna(ReversiConst.REVERSI_STS_WHITE, i, j) != 0) {
                            sum += this.mMasuStsCntW[i][j];
                            if (this.mMasuStsAnzB[tmpY][tmpX].max < this.mMasuStsCntW[i][j])
                                this.mMasuStsAnzB[tmpY][tmpX].max = this.mMasuStsCntW[i][j];
                            if (this.mMasuStsCntW[i][j] < this.mMasuStsAnzB[tmpY][tmpX].min)
                                this.mMasuStsAnzB[tmpY][tmpX].min = this.mMasuStsCntW[i][j];
                            this.mMasuStsAnzB[tmpY][tmpX].pointCnt++;
                            if (this.getEdgeSideZero(i, j) == 0) {
                                this.mMasuStsAnzB[tmpY][tmpX].edgeCnt++;
                                tmpBadPoint = 100000 * this.mMasuStsCntW[i][j];
                            }
                            else if (this.getEdgeSideOne(i, j) == 0) {
                                this.mMasuStsAnzB[tmpY][tmpX].edgeSideOneCnt++;
                                tmpBadPoint = 0;
                            }
                            else if (this.getEdgeSideTwo(i, j) == 0) {
                                this.mMasuStsAnzB[tmpY][tmpX].edgeSideTwoCnt++;
                                tmpBadPoint = 1 * this.mMasuStsCntW[i][j];
                            }
                            else if (this.getEdgeSideThree(i, j) == 0) {
                                this.mMasuStsAnzB[tmpY][tmpX].edgeSideThreeCnt++;
                                tmpBadPoint = 1 * this.mMasuStsCntW[i][j];
                            }
                            else {
                                this.mMasuStsAnzB[tmpY][tmpX].edgeSideOtherCnt++;
                                tmpBadPoint = 1 * this.mMasuStsCntW[i][j];
                            }
                            if (tmpMasuEnaW[i][j] != 0)
                                tmpBadPoint = 0;
                        }
                        if (this.getMasuStsEna(ReversiConst.REVERSI_STS_BLACK, i, j) != 0) {
                            sumOwn += this.mMasuStsCntB[i][j];
                            if (this.mMasuStsAnzB[tmpY][tmpX].ownMax < this.mMasuStsCntB[i][j])
                                this.mMasuStsAnzB[tmpY][tmpX].ownMax = this.mMasuStsCntB[i][j];
                            if (this.mMasuStsCntB[i][j] < this.mMasuStsAnzB[tmpY][tmpX].ownMin)
                                this.mMasuStsAnzB[tmpY][tmpX].ownMin = this.mMasuStsCntB[i][j];
                            this.mMasuStsAnzB[tmpY][tmpX].ownPointCnt++;
                            if (this.getEdgeSideZero(i, j) == 0) {
                                this.mMasuStsAnzB[tmpY][tmpX].ownEdgeCnt++;
                                tmpGoodPoint = 100 * this.mMasuStsCntB[i][j];
                            }
                            else if (this.getEdgeSideOne(i, j) == 0) {
                                this.mMasuStsAnzB[tmpY][tmpX].ownEdgeSideOneCnt++;
                                tmpGoodPoint = 0;
                            }
                            else if (this.getEdgeSideTwo(i, j) == 0) {
                                this.mMasuStsAnzB[tmpY][tmpX].ownEdgeSideTwoCnt++;
                                tmpGoodPoint = 3 * this.mMasuStsCntB[i][j];
                            }
                            else if (this.getEdgeSideThree(i, j) == 0) {
                                this.mMasuStsAnzB[tmpY][tmpX].ownEdgeSideThreeCnt++;
                                tmpGoodPoint = 2 * this.mMasuStsCntB[i][j];
                            }
                            else {
                                this.mMasuStsAnzB[tmpY][tmpX].ownEdgeSideOtherCnt++;
                                tmpGoodPoint = 1 * this.mMasuStsCntB[i][j];
                            }
                            if (tmpMasuEnaB[i][j] != 0)
                                tmpGoodPoint = 0;
                        }
                        if (tmpBadPoint != 0)
                            this.mMasuStsAnzB[tmpY][tmpX].badPoint += tmpBadPoint;
                        if (tmpGoodPoint != 0)
                            this.mMasuStsAnzB[tmpY][tmpX].goodPoint += tmpGoodPoint;
                    }
                }
                if (this.getPointCnt(ReversiConst.REVERSI_STS_WHITE) != 0) {
                    tmpD1 = sum;
                    tmpD2 = this.getPointCnt(ReversiConst.REVERSI_STS_WHITE);
                    this.mMasuStsAnzB[tmpY][tmpX].avg = tmpD1 / tmpD2;
                }
                if (this.getPointCnt(ReversiConst.REVERSI_STS_BLACK) != 0) {
                    tmpD1 = sumOwn;
                    tmpD2 = this.getPointCnt(ReversiConst.REVERSI_STS_BLACK);
                    this.mMasuStsAnzB[tmpY][tmpX].ownAvg = tmpD1 / tmpD2;
                }
                this.mMasuSts = extend(true, [], tmpMasu);
                this.makeMasuSts(ReversiConst.REVERSI_STS_BLACK);
                this.makeMasuSts(ReversiConst.REVERSI_STS_WHITE);
            }
        };
        Reversi.prototype.AnalysisReversiWhite = function () {
            var tmpX;
            var tmpY;
            var sum;
            var sumOwn;
            var tmpGoodPoint;
            var tmpBadPoint;
            var tmpD1;
            var tmpD2;
            for (var cnt = 0; cnt < this.mMasuPointCntW; cnt++) {
                var tmpMasu = extend(true, [], this.mMasuSts);
                var tmpMasuEnaB = extend(true, [], this.mMasuStsEnaB);
                var tmpMasuEnaW = extend(true, [], this.mMasuStsEnaW);
                tmpY = this.mMasuPointW[cnt].y;
                tmpX = this.mMasuPointW[cnt].x;
                this.mMasuSts[tmpY][tmpX] = ReversiConst.REVERSI_STS_WHITE;
                this.revMasuSts(ReversiConst.REVERSI_STS_WHITE, tmpY, tmpX);
                this.makeMasuSts(ReversiConst.REVERSI_STS_BLACK);
                this.makeMasuSts(ReversiConst.REVERSI_STS_WHITE);
                if (this.getColorEna(ReversiConst.REVERSI_STS_BLACK) != 0) {
                    this.mMasuStsPassW[tmpY][tmpX] = 1;
                }
                if (this.getEdgeSideZero(tmpY, tmpX) == 0) {
                    this.mMasuStsAnzW[tmpY][tmpX].ownEdgeCnt++;
                    this.mMasuStsAnzW[tmpY][tmpX].goodPoint +=
                        10000 * this.mMasuStsCntW[tmpY][tmpX];
                }
                else if (this.getEdgeSideOne(tmpY, tmpX) == 0) {
                    this.mMasuStsAnzW[tmpY][tmpX].ownEdgeSideOneCnt++;
                    if (this.checkEdge(ReversiConst.REVERSI_STS_WHITE, tmpY, tmpX) != 0) {
                        this.mMasuStsAnzW[tmpY][tmpX].goodPoint +=
                            10 * this.mMasuStsCntW[tmpY][tmpX];
                    }
                    else {
                        this.mMasuStsAnzW[tmpY][tmpX].badPoint += 100000;
                    }
                }
                else if (this.getEdgeSideTwo(tmpY, tmpX) == 0) {
                    this.mMasuStsAnzW[tmpY][tmpX].ownEdgeSideTwoCnt++;
                    this.mMasuStsAnzW[tmpY][tmpX].goodPoint +=
                        1000 * this.mMasuStsCntW[tmpY][tmpX];
                }
                else if (this.getEdgeSideThree(tmpY, tmpX) == 0) {
                    this.mMasuStsAnzW[tmpY][tmpX].ownEdgeSideThreeCnt++;
                    this.mMasuStsAnzW[tmpY][tmpX].goodPoint +=
                        100 * this.mMasuStsCntW[tmpY][tmpX];
                }
                else {
                    this.mMasuStsAnzW[tmpY][tmpX].ownEdgeSideOtherCnt++;
                    this.mMasuStsAnzW[tmpY][tmpX].goodPoint +=
                        10 * this.mMasuStsCntW[tmpY][tmpX];
                }
                sum = 0;
                sumOwn = 0;
                for (var i = 0; i < this.mMasuCnt; i++) {
                    for (var j = 0; j < this.mMasuCnt; j++) {
                        tmpBadPoint = 0;
                        tmpGoodPoint = 0;
                        if (this.getMasuStsEna(ReversiConst.REVERSI_STS_BLACK, i, j) != 0) {
                            sum += this.mMasuStsCntB[i][j];
                            if (this.mMasuStsAnzW[tmpY][tmpX].max < this.mMasuStsCntB[i][j])
                                this.mMasuStsAnzW[tmpY][tmpX].max = this.mMasuStsCntB[i][j];
                            if (this.mMasuStsCntB[i][j] < this.mMasuStsAnzW[tmpY][tmpX].min)
                                this.mMasuStsAnzW[tmpY][tmpX].min = this.mMasuStsCntB[i][j];
                            this.mMasuStsAnzW[tmpY][tmpX].pointCnt++;
                            if (this.getEdgeSideZero(i, j) == 0) {
                                this.mMasuStsAnzW[tmpY][tmpX].edgeCnt++;
                                tmpBadPoint = 100000 * this.mMasuStsCntB[i][j];
                            }
                            else if (this.getEdgeSideOne(i, j) == 0) {
                                this.mMasuStsAnzW[tmpY][tmpX].edgeSideOneCnt++;
                                tmpBadPoint = 0;
                            }
                            else if (this.getEdgeSideTwo(i, j) == 0) {
                                this.mMasuStsAnzW[tmpY][tmpX].edgeSideTwoCnt++;
                                tmpBadPoint = 1 * this.mMasuStsCntB[i][j];
                            }
                            else if (this.getEdgeSideThree(i, j) == 0) {
                                this.mMasuStsAnzW[tmpY][tmpX].edgeSideThreeCnt++;
                                tmpBadPoint = 1 * this.mMasuStsCntB[i][j];
                            }
                            else {
                                this.mMasuStsAnzW[tmpY][tmpX].edgeSideOtherCnt++;
                                tmpBadPoint = 1 * this.mMasuStsCntB[i][j];
                            }
                            if (tmpMasuEnaB[i][j] != 0)
                                tmpBadPoint = 0;
                        }
                        if (this.getMasuStsEna(ReversiConst.REVERSI_STS_WHITE, i, j) != 0) {
                            sumOwn += this.mMasuStsCntW[i][j];
                            if (this.mMasuStsAnzW[tmpY][tmpX].ownMax < this.mMasuStsCntW[i][j])
                                this.mMasuStsAnzW[tmpY][tmpX].ownMax = this.mMasuStsCntW[i][j];
                            if (this.mMasuStsCntW[i][j] < this.mMasuStsAnzW[tmpY][tmpX].ownMin)
                                this.mMasuStsAnzW[tmpY][tmpX].ownMin = this.mMasuStsCntW[i][j];
                            this.mMasuStsAnzW[tmpY][tmpX].ownPointCnt++;
                            if (this.getEdgeSideZero(i, j) == 0) {
                                this.mMasuStsAnzW[tmpY][tmpX].ownEdgeCnt++;
                                tmpGoodPoint = 100 * this.mMasuStsCntW[i][j];
                            }
                            else if (this.getEdgeSideOne(i, j) == 0) {
                                this.mMasuStsAnzW[tmpY][tmpX].ownEdgeSideOneCnt++;
                                tmpGoodPoint = 0;
                            }
                            else if (this.getEdgeSideTwo(i, j) == 0) {
                                this.mMasuStsAnzW[tmpY][tmpX].ownEdgeSideTwoCnt++;
                                tmpGoodPoint = 3 * this.mMasuStsCntW[i][j];
                            }
                            else if (this.getEdgeSideThree(i, j) == 0) {
                                this.mMasuStsAnzW[tmpY][tmpX].ownEdgeSideThreeCnt++;
                                tmpGoodPoint = 2 * this.mMasuStsCntW[i][j];
                            }
                            else {
                                this.mMasuStsAnzW[tmpY][tmpX].ownEdgeSideOtherCnt++;
                                tmpGoodPoint = 1 * this.mMasuStsCntW[i][j];
                            }
                            if (tmpMasuEnaW[i][j] != 0)
                                tmpGoodPoint = 0;
                        }
                        if (tmpBadPoint != 0)
                            this.mMasuStsAnzW[tmpY][tmpX].badPoint += tmpBadPoint;
                        if (tmpGoodPoint != 0)
                            this.mMasuStsAnzW[tmpY][tmpX].goodPoint += tmpGoodPoint;
                    }
                }
                if (this.getPointCnt(ReversiConst.REVERSI_STS_BLACK) != 0) {
                    tmpD1 = sum;
                    tmpD2 = this.getPointCnt(ReversiConst.REVERSI_STS_BLACK);
                    this.mMasuStsAnzW[tmpY][tmpX].avg = tmpD1 / tmpD2;
                }
                if (this.getPointCnt(ReversiConst.REVERSI_STS_WHITE) != 0) {
                    tmpD1 = sumOwn;
                    tmpD2 = this.getPointCnt(ReversiConst.REVERSI_STS_WHITE);
                    this.mMasuStsAnzW[tmpY][tmpX].ownAvg = tmpD1 / tmpD2;
                }
                this.mMasuSts = extend(true, [], tmpMasu);
                this.makeMasuSts(ReversiConst.REVERSI_STS_BLACK);
                this.makeMasuSts(ReversiConst.REVERSI_STS_WHITE);
            }
        };
        Reversi.prototype.AnalysisReversi = function (bPassEna, wPassEna) {
            var tmpX;
            var tmpY;
            var sum;
            var sumOwn;
            var tmpGoodPoint;
            var tmpBadPoint;
            var tmpD1;
            var tmpD2;
            for (var i = 0; i < this.mMasuCnt; i++) {
                for (var j = 0; j < this.mMasuCnt; j++) {
                    this.mMasuStsPassB[i][j] = 0;
                    this.mMasuStsAnzB[i][j].reset();
                    this.mMasuStsPassW[i][j] = 0;
                    this.mMasuStsAnzW[i][j].reset();
                }
            }
            this.AnalysisReversiBlack();
            this.AnalysisReversiWhite();
            this.makeMasuSts(ReversiConst.REVERSI_STS_BLACK);
            this.makeMasuSts(ReversiConst.REVERSI_STS_WHITE);
            for (var i = 0; i < this.mMasuCnt; i++) {
                for (var j = 0; j < this.mMasuCnt; j++) {
                    if (this.mMasuStsPassB[i][j] != 0) {
                        if (bPassEna != 0)
                            this.mMasuStsEnaB[i][j] = 3;
                    }
                    if (this.mMasuStsPassW[i][j] != 0) {
                        if (wPassEna != 0)
                            this.mMasuStsEnaW[i][j] = 3;
                    }
                }
            }
        };
        Reversi.prototype.getMasuSts = function (y, x) {
            var ret = -1;
            if (this.checkPara(y, 0, this.mMasuCnt) == 0 &&
                this.checkPara(x, 0, this.mMasuCnt) == 0)
                ret = this.mMasuSts[y][x];
            return ret;
        };
        Reversi.prototype.getMasuStsOld = function (y, x) {
            var ret = -1;
            if (this.checkPara(y, 0, this.mMasuCnt) == 0 &&
                this.checkPara(x, 0, this.mMasuCnt) == 0)
                ret = this.mMasuStsOld[y][x];
            return ret;
        };
        Reversi.prototype.getMasuStsEna = function (color, y, x) {
            var ret = 0;
            if (this.checkPara(y, 0, this.mMasuCnt) == 0 &&
                this.checkPara(x, 0, this.mMasuCnt) == 0) {
                if (color == ReversiConst.REVERSI_STS_BLACK)
                    ret = this.mMasuStsEnaB[y][x];
                else
                    ret = this.mMasuStsEnaW[y][x];
            }
            return ret;
        };
        Reversi.prototype.getMasuStsCnt = function (color, y, x) {
            var ret = -1;
            if (this.checkPara(y, 0, this.mMasuCnt) == 0 &&
                this.checkPara(x, 0, this.mMasuCnt) == 0) {
                if (color == ReversiConst.REVERSI_STS_BLACK)
                    ret = this.mMasuStsCntB[y][x];
                else
                    ret = this.mMasuStsCntW[y][x];
            }
            return ret;
        };
        Reversi.prototype.getColorEna = function (color) {
            var ret = -1;
            for (var i = 0; i < this.mMasuCnt; i++) {
                for (var j = 0; j < this.mMasuCnt; j++) {
                    if (this.getMasuStsEna(color, i, j) != 0) {
                        ret = 0;
                        break;
                    }
                }
            }
            return ret;
        };
        Reversi.prototype.getGameEndSts = function () {
            var ret = 1;
            if (this.getColorEna(ReversiConst.REVERSI_STS_BLACK) == 0)
                ret = 0;
            if (this.getColorEna(ReversiConst.REVERSI_STS_WHITE) == 0)
                ret = 0;
            return ret;
        };
        Reversi.prototype.setMasuSts = function (color, y, x) {
            var ret = -1;
            if (this.getMasuStsEna(color, y, x) != 0) {
                ret = 0;
                this.mMasuStsOld = extend(true, [], this.mMasuSts);
                this.mMasuSts[y][x] = color;
                this.revMasuSts(color, y, x);
                this.makeMasuSts(ReversiConst.REVERSI_STS_BLACK);
                this.makeMasuSts(ReversiConst.REVERSI_STS_WHITE);
                if (this.mMasuHistCur < this.mMasuCntMax * this.mMasuCntMax) {
                    this.mMasuHist[this.mMasuHistCur].color = color;
                    this.mMasuHist[this.mMasuHistCur].point.y = y;
                    this.mMasuHist[this.mMasuHistCur].point.x = x;
                    this.mMasuHistCur++;
                }
            }
            return ret;
        };
        Reversi.prototype.setMasuStsForcibly = function (color, y, x) {
            var ret = -1;
            ret = 0;
            this.mMasuStsOld = extend(true, [], this.mMasuSts);
            this.mMasuSts[y][x] = color;
            return ret;
        };
        Reversi.prototype.setMasuCnt = function (cnt) {
            var ret = -1;
            var chg = 0;
            if (this.checkPara(cnt, 0, this.mMasuCntMax) == 0) {
                if (this.mMasuCnt != cnt)
                    chg = 1;
                this.mMasuCnt = cnt;
                ret = 0;
                if (chg == 1)
                    this.reset();
            }
            return ret;
        };
        Reversi.prototype.getPoint = function (color, num) {
            var ret = null;
            if (this.checkPara(num, 0, this.mMasuCnt * this.mMasuCnt) == 0) {
                if (color == ReversiConst.REVERSI_STS_BLACK)
                    ret = this.mMasuPointB[num];
                else
                    ret = this.mMasuPointW[num];
            }
            return ret;
        };
        Reversi.prototype.getPointCnt = function (color) {
            var ret = 0;
            if (color == ReversiConst.REVERSI_STS_BLACK)
                ret = this.mMasuPointCntB;
            else
                ret = this.mMasuPointCntW;
            return ret;
        };
        Reversi.prototype.getBetCnt = function (color) {
            var ret = 0;
            if (color == ReversiConst.REVERSI_STS_BLACK)
                ret = this.mMasuBetCntB;
            else
                ret = this.mMasuBetCntW;
            return ret;
        };
        Reversi.prototype.getPassEna = function (color, y, x) {
            var ret = 0;
            if (this.checkPara(y, 0, this.mMasuCnt) == 0 &&
                this.checkPara(x, 0, this.mMasuCnt) == 0) {
                if (color == ReversiConst.REVERSI_STS_BLACK)
                    ret = this.mMasuStsPassB[y][x];
                else
                    ret = this.mMasuStsPassW[y][x];
            }
            return ret;
        };
        Reversi.prototype.getHistory = function (num) {
            var ret = null;
            if (this.checkPara(num, 0, this.mMasuCnt * this.mMasuCnt) == 0) {
                ret = this.mMasuHist[num];
            }
            return ret;
        };
        Reversi.prototype.getHistoryCnt = function () {
            var ret = 0;
            ret = this.mMasuHistCur;
            return ret;
        };
        Reversi.prototype.getPointAnz = function (color, y, x) {
            var ret = null;
            if (this.checkPara(y, 0, this.mMasuCnt) == 0 &&
                this.checkPara(x, 0, this.mMasuCnt) == 0) {
                if (color == ReversiConst.REVERSI_STS_BLACK)
                    ret = this.mMasuStsAnzB[y][x];
                else
                    ret = this.mMasuStsAnzW[y][x];
            }
            return ret;
        };
        Reversi.prototype.checkEdge = function (color, y, x) {
            var style = 0;
            var flg1 = 0;
            var flg2 = 0;
            var loop;
            var loop2;
            if (y == 0 && x == 1) {
                for (loop = x, flg1 = 0, flg2 = 0; loop < this.mMasuCnt; loop++) {
                    if (this.getMasuSts(y, loop) == color)
                        flg1 = 1;
                    if (flg1 == 1 &&
                        this.getMasuSts(y, loop) == ReversiConst.REVERSI_STS_NONE)
                        break;
                    if (flg1 == 1 &&
                        this.getMasuSts(y, loop) != color &&
                        this.getMasuSts(y, loop) != ReversiConst.REVERSI_STS_NONE)
                        flg2 = 1;
                }
                if (flg1 == 1 && flg2 == 0)
                    style = 1;
            }
            if (y == 1 && x == 0) {
                for (loop = y, flg1 = 0, flg2 = 0; loop < this.mMasuCnt; loop++) {
                    if (this.getMasuSts(loop, x) == color)
                        flg1 = 1;
                    if (flg1 == 1 &&
                        this.getMasuSts(loop, x) == ReversiConst.REVERSI_STS_NONE)
                        break;
                    if (flg1 == 1 &&
                        this.getMasuSts(loop, x) != color &&
                        this.getMasuSts(loop, x) != ReversiConst.REVERSI_STS_NONE)
                        flg2 = 1;
                }
                if (flg1 == 1 && flg2 == 0)
                    style = 1;
            }
            if (y == 1 && x == 1) {
                for (loop = y, flg1 = 0, flg2 = 0; loop < this.mMasuCnt; loop++) {
                    if (this.getMasuSts(loop, loop) == color)
                        flg1 = 1;
                    if (flg1 == 1 &&
                        this.getMasuSts(loop, loop) == ReversiConst.REVERSI_STS_NONE)
                        break;
                    if (flg1 == 1 &&
                        this.getMasuSts(loop, loop) != color &&
                        this.getMasuSts(loop, loop) != ReversiConst.REVERSI_STS_NONE)
                        flg2 = 1;
                }
                if (flg1 == 1 && flg2 == 0)
                    style = 1;
            }
            if (y == 0 && x == this.mMasuCnt - 2) {
                for (loop = x, flg1 = 0, flg2 = 0; loop > 0; loop--) {
                    if (this.getMasuSts(y, loop) == color)
                        flg1 = 1;
                    if (flg1 == 1 &&
                        this.getMasuSts(y, loop) == ReversiConst.REVERSI_STS_NONE)
                        break;
                    if (flg1 == 1 &&
                        this.getMasuSts(y, loop) != color &&
                        this.getMasuSts(y, loop) != ReversiConst.REVERSI_STS_NONE)
                        flg2 = 1;
                }
                if (flg1 == 1 && flg2 == 0)
                    style = 1;
            }
            if (y == 1 && x == this.mMasuCnt - 1) {
                for (loop = y, flg1 = 0, flg2 = 0; loop < this.mMasuCnt; loop++) {
                    if (this.getMasuSts(loop, x) == color)
                        flg1 = 1;
                    if (flg1 == 1 &&
                        this.getMasuSts(loop, x) == ReversiConst.REVERSI_STS_NONE)
                        break;
                    if (flg1 == 1 &&
                        this.getMasuSts(loop, x) != color &&
                        this.getMasuSts(loop, x) != ReversiConst.REVERSI_STS_NONE)
                        flg2 = 1;
                }
                if (flg1 == 1 && flg2 == 0)
                    style = 1;
            }
            if (y == 1 && x == this.mMasuCnt - 2) {
                for (loop = y, loop2 = x, flg1 = 0, flg2 = 0; loop < this.mMasuCnt; loop++, loop2--) {
                    if (this.getMasuSts(loop, loop2) == color)
                        flg1 = 1;
                    if (flg1 == 1 &&
                        this.getMasuSts(loop, loop2) == ReversiConst.REVERSI_STS_NONE)
                        break;
                    if (flg1 == 1 &&
                        this.getMasuSts(loop, loop2) != color &&
                        this.getMasuSts(loop, loop2) != ReversiConst.REVERSI_STS_NONE)
                        flg2 = 1;
                }
                if (flg1 == 1 && flg2 == 0)
                    style = 1;
            }
            if (y == this.mMasuCnt - 2 && x == 0) {
                for (loop = y, flg1 = 0, flg2 = 0; loop > 0; loop--) {
                    if (this.getMasuSts(loop, x) == color)
                        flg1 = 1;
                    if (flg1 == 1 &&
                        this.getMasuSts(loop, x) == ReversiConst.REVERSI_STS_NONE)
                        break;
                    if (flg1 == 1 &&
                        this.getMasuSts(loop, x) != color &&
                        this.getMasuSts(loop, x) != ReversiConst.REVERSI_STS_NONE)
                        flg2 = 1;
                }
                if (flg1 == 1 && flg2 == 0)
                    style = 1;
            }
            if (y == this.mMasuCnt - 1 && x == 1) {
                for (loop = x, flg1 = 0, flg2 = 0; loop < this.mMasuCnt; loop++) {
                    if (this.getMasuSts(y, loop) == color)
                        flg1 = 1;
                    if (flg1 == 1 &&
                        this.getMasuSts(y, loop) == ReversiConst.REVERSI_STS_NONE)
                        break;
                    if (flg1 == 1 &&
                        this.getMasuSts(y, loop) != color &&
                        this.getMasuSts(y, loop) != ReversiConst.REVERSI_STS_NONE)
                        flg2 = 1;
                }
                if (flg1 == 1 && flg2 == 0)
                    style = 1;
            }
            if (y == this.mMasuCnt - 2 && x == 1) {
                for (loop = y, loop2 = x, flg1 = 0, flg2 = 0; loop > 0; loop--, loop2++) {
                    if (this.getMasuSts(loop, loop2) == color)
                        flg1 = 1;
                    if (flg1 == 1 &&
                        this.getMasuSts(loop, loop2) == ReversiConst.REVERSI_STS_NONE)
                        break;
                    if (flg1 == 1 &&
                        this.getMasuSts(loop, loop2) != color &&
                        this.getMasuSts(loop, loop2) != ReversiConst.REVERSI_STS_NONE)
                        flg2 = 1;
                }
                if (flg1 == 1 && flg2 == 0)
                    style = 1;
            }
            if (y == this.mMasuCnt - 2 && x == this.mMasuCnt - 1) {
                for (loop = y, flg1 = 0, flg2 = 0; loop > 0; loop--) {
                    if (this.getMasuSts(loop, x) == color)
                        flg1 = 1;
                    if (flg1 == 1 &&
                        this.getMasuSts(loop, x) == ReversiConst.REVERSI_STS_NONE)
                        break;
                    if (flg1 == 1 &&
                        this.getMasuSts(loop, x) != color &&
                        this.getMasuSts(loop, x) != ReversiConst.REVERSI_STS_NONE)
                        flg2 = 1;
                }
                if (flg1 == 1 && flg2 == 0)
                    style = 1;
            }
            if (y == this.mMasuCnt - 1 && x == this.mMasuCnt - 2) {
                for (loop = x, flg1 = 0, flg2 = 0; loop > 0; loop--) {
                    if (this.getMasuSts(y, loop) == color)
                        flg1 = 1;
                    if (flg1 == 1 &&
                        this.getMasuSts(y, loop) == ReversiConst.REVERSI_STS_NONE)
                        break;
                    if (flg1 == 1 &&
                        this.getMasuSts(y, loop) != color &&
                        this.getMasuSts(y, loop) != ReversiConst.REVERSI_STS_NONE)
                        flg2 = 1;
                }
                if (flg1 == 1 && flg2 == 0)
                    style = 1;
            }
            if (y == this.mMasuCnt - 2 && x == this.mMasuCnt - 2) {
                for (loop = y, loop2 = x, flg1 = 0, flg2 = 0; loop > 0; loop--, loop2--) {
                    if (this.getMasuSts(loop, loop2) == color)
                        flg1 = 1;
                    if (flg1 == 1 &&
                        this.getMasuSts(loop, loop2) == ReversiConst.REVERSI_STS_NONE)
                        break;
                    if (flg1 == 1 &&
                        this.getMasuSts(loop, loop2) != color &&
                        this.getMasuSts(loop, loop2) != ReversiConst.REVERSI_STS_NONE)
                        flg2 = 1;
                }
                if (flg1 == 1 && flg2 == 0)
                    style = 1;
            }
            return style;
        };
        Reversi.prototype.getEdgeSideZero = function (y, x) {
            var ret = -1;
            if ((y == 0 && x == 0) ||
                (y == 0 && x == this.mMasuCnt - 1) ||
                (y == this.mMasuCnt - 1 && x == 0) ||
                (y == this.mMasuCnt - 1 && x == this.mMasuCnt - 1)) {
                ret = 0;
            }
            return ret;
        };
        Reversi.prototype.getEdgeSideOne = function (y, x) {
            var ret = -1;
            if ((y == 0 && x == 1) ||
                (y == 0 && x == this.mMasuCnt - 2) ||
                (y == 1 && x == 0) ||
                (y == 1 && x == 1) ||
                (y == 1 && x == this.mMasuCnt - 2) ||
                (y == 1 && x == this.mMasuCnt - 1) ||
                (y == this.mMasuCnt - 2 && x == 0) ||
                (y == this.mMasuCnt - 2 && x == 1) ||
                (y == this.mMasuCnt - 2 && x == this.mMasuCnt - 2) ||
                (y == this.mMasuCnt - 2 && x == this.mMasuCnt - 1) ||
                (y == this.mMasuCnt - 1 && x == 1) ||
                (y == this.mMasuCnt - 1 && x == this.mMasuCnt - 2)) {
                ret = 0;
            }
            return ret;
        };
        Reversi.prototype.getEdgeSideTwo = function (y, x) {
            var ret = -1;
            if ((y == 0 && x == 2) ||
                (y == 0 && x == this.mMasuCnt - 3) ||
                (y == 2 && x == 0) ||
                (y == 2 && x == 2) ||
                (y == 2 && x == this.mMasuCnt - 3) ||
                (y == 2 && x == this.mMasuCnt - 1) ||
                (y == this.mMasuCnt - 3 && x == 0) ||
                (y == this.mMasuCnt - 3 && x == 2) ||
                (y == this.mMasuCnt - 3 && x == this.mMasuCnt - 3) ||
                (y == this.mMasuCnt - 3 && x == this.mMasuCnt - 1) ||
                (y == this.mMasuCnt - 1 && x == 2) ||
                (y == this.mMasuCnt - 1 && x == this.mMasuCnt - 3)) {
                ret = 0;
            }
            return ret;
        };
        Reversi.prototype.getEdgeSideThree = function (y, x) {
            var ret = -1;
            if ((y == 0 && 3 <= x && x <= this.mMasuCnt - 4) ||
                (3 <= y && y <= this.mMasuCnt - 4 && x == 0) ||
                (y == this.mMasuCnt - 1 && 3 <= x && x <= this.mMasuCnt - 4) ||
                (3 <= y && y <= this.mMasuCnt - 4 && x == this.mMasuCnt - 1)) {
                ret = 0;
            }
            return ret;
        };
        Reversi.prototype.setSession = function (session) {
            this.mMasuSts = session.mMasuSts;
            this.mMasuStsOld = session.mMasuStsOld;
            this.mMasuStsEnaB = session.mMasuStsEnaB;
            this.mMasuStsCntB = session.mMasuStsCntB;
            this.mMasuStsPassB = session.mMasuStsPassB;
            for (var i = 0; i < this.mMasuCntMax; i++) {
                for (var j = 0; j < this.mMasuCntMax; j++) {
                    this.mMasuStsAnzB[i][j].setSession(session.mMasuStsAnzB[i][j]);
                    this.mMasuStsAnzW[i][j].setSession(session.mMasuStsAnzW[i][j]);
                }
            }
            this.mMasuPointB = session.mMasuPointB;
            this.mMasuPointCntB = session.mMasuPointCntB;
            this.mMasuBetCntB = session.mMasuBetCntB;
            this.mMasuStsEnaW = session.mMasuStsEnaW;
            this.mMasuStsCntW = session.mMasuStsCntW;
            this.mMasuStsPassW = session.mMasuStsPassW;
            this.mMasuPointW = session.mMasuPointW;
            this.mMasuPointCntW = session.mMasuPointCntW;
            this.mMasuBetCntW = session.mMasuBetCntW;
            this.mMasuCnt = session.mMasuCnt;
            this.mMasuCntMax = session.mMasuCntMax;
            this.mMasuHistCur = session.mMasuHistCur;
            this.mMasuHist = session.mMasuHist;
        };
        return Reversi;
    }());
})(ReversiWrap || (ReversiWrap = {}));
//# sourceMappingURL=Reversi.js.map