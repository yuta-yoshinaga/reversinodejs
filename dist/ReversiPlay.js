var ReversiPlayWrap;
(function (ReversiPlayWrap) {
    var LC_MSG_DRAW = 0;
    var LC_MSG_ERASE = 1;
    var LC_MSG_DRAW_INFO = 2;
    var LC_MSG_ERASE_INFO = 3;
    var LC_MSG_DRAW_ALL = 4;
    var LC_MSG_ERASE_ALL = 5;
    var LC_MSG_DRAW_INFO_ALL = 6;
    var LC_MSG_ERASE_INFO_ALL = 7;
    var LC_MSG_DRAW_END = 8;
    var LC_MSG_CUR_COL = 9;
    var LC_MSG_CUR_COL_ERASE = 10;
    var LC_MSG_CUR_STS = 11;
    var LC_MSG_CUR_STS_ERASE = 12;
    var LC_MSG_MSG_DLG = 13;
    var LC_MSG_DRAW_ALL_RESET = 14;
    var ReversiAnz = require("./ReversiAnz");
    var ReversiPoint = require("./ReversiPoint");
    var ReversiConst = require("./ReversiConst");
    var Reversi = require("./Reversi");
    var ReversiSetting = require("./ReversiSetting");
    var ReversiPlayDelegate = require("./ReversiPlayDelegate");
    var CallbacksJson = require("./CallbacksJson");
    module.exports = (function () {
        function ReversiPlay() {
            this.mCurColor = 0;
            this.mPassEnaB = 0;
            this.mPassEnaW = 0;
            this.mGameEndSts = 0;
            this.mPlayLock = 0;
            this.mReversi = new Reversi(ReversiConst.DEF_MASU_CNT_MAX_VAL, ReversiConst.DEF_MASU_CNT_MAX_VAL);
            this.mSetting = new ReversiSetting();
            this.mCpu = new Array();
            this.mEdge = new Array();
            for (var i = 0; i <
                ReversiConst.DEF_MASU_CNT_MAX_VAL * ReversiConst.DEF_MASU_CNT_MAX_VAL; i++) {
                this.mCpu[i] = new ReversiPoint();
                this.mEdge[i] = new ReversiPoint();
            }
            this.mDelegate = null;
            this.mCallbacks = null;
            this.reset();
        }
        ReversiPlay.prototype.reversiPlay = function (y, x) {
            var update = 0;
            var cpuEna = 0;
            var tmpCol = this.mCurColor;
            var ret;
            var pass = 0;
            if (this.mPlayLock == 1)
                return;
            this.mPlayLock = 1;
            if (this.mReversi.getColorEna(this.mCurColor) == 0) {
                if (this.mReversi.setMasuSts(this.mCurColor, y, x) == 0) {
                    if (this.mSetting.mType == ReversiConst.DEF_TYPE_HARD)
                        this.mReversi.AnalysisReversi(this.mPassEnaB, this.mPassEnaW);
                    if (this.mSetting.mAssist == ReversiConst.DEF_ASSIST_ON) {
                        this.execMessage(LC_MSG_ERASE_INFO_ALL, null);
                    }
                    this.sendDrawMsg(y, x);
                    this.drawUpdate(ReversiConst.DEF_ASSIST_OFF);
                    if (this.mReversi.getGameEndSts() == 0) {
                        if (tmpCol == ReversiConst.REVERSI_STS_BLACK)
                            tmpCol = ReversiConst.REVERSI_STS_WHITE;
                        else
                            tmpCol = ReversiConst.REVERSI_STS_BLACK;
                        if (this.mReversi.getColorEna(tmpCol) == 0) {
                            if (this.mSetting.mMode == ReversiConst.DEF_MODE_ONE) {
                                cpuEna = 1;
                            }
                            else {
                                this.mCurColor = tmpCol;
                                this.drawUpdate(this.mSetting.mAssist);
                            }
                        }
                        else {
                            this.reversiPlayPass(tmpCol);
                            pass = 1;
                        }
                    }
                    else {
                        this.reversiPlayEnd();
                    }
                    update = 1;
                }
                else {
                    this.viewMsgDlg("エラー", "そのマスには置けません。");
                }
            }
            else {
                if (this.mReversi.getGameEndSts() == 0) {
                    if (tmpCol == ReversiConst.REVERSI_STS_BLACK)
                        tmpCol = ReversiConst.REVERSI_STS_WHITE;
                    else
                        tmpCol = ReversiConst.REVERSI_STS_BLACK;
                    if (this.mReversi.getColorEna(tmpCol) == 0) {
                        if (this.mSetting.mMode == ReversiConst.DEF_MODE_ONE) {
                            update = 1;
                            cpuEna = 1;
                        }
                        else {
                            this.mCurColor = tmpCol;
                        }
                    }
                    else {
                        this.reversiPlayPass(tmpCol);
                        pass = 1;
                    }
                }
                else {
                    this.reversiPlayEnd();
                }
            }
            if (pass == 1) {
                if (this.mSetting.mMode == ReversiConst.DEF_MODE_ONE) {
                    if (this.mSetting.mAssist == ReversiConst.DEF_ASSIST_ON) {
                        this.execMessage(LC_MSG_DRAW_INFO_ALL, null);
                    }
                }
            }
            if (update == 1) {
                var waitTime = 0;
                if (cpuEna == 1) {
                    waitTime = this.mSetting.mPlayCpuInterVal;
                }
                this.wait(waitTime);
                this.reversiPlaySub(cpuEna, tmpCol);
                this.mPlayLock = 0;
            }
            else {
                this.mPlayLock = 0;
            }
        };
        ReversiPlay.prototype.reversiPlaySub = function (cpuEna, tmpCol) {
            var ret;
            for (;;) {
                ret = this.reversiPlayCpu(tmpCol, cpuEna);
                cpuEna = 0;
                if (ret == 1) {
                    if (this.mReversi.getGameEndSts() == 0) {
                        if (this.mReversi.getColorEna(this.mCurColor) != 0) {
                            this.reversiPlayPass(this.mCurColor);
                            cpuEna = 1;
                        }
                    }
                    else {
                        this.reversiPlayEnd();
                    }
                }
                if (cpuEna == 0)
                    break;
            }
        };
        ReversiPlay.prototype.reversiPlayEnd = function () {
            if (this.mGameEndSts == 0) {
                this.mGameEndSts = 1;
                var waitTime = this.gameEndAnimExec();
                this.mPlayLock = 1;
                this.wait(waitTime);
                var tmpMsg1, tmpMsg2, msgStr;
                var blk, whi;
                blk = this.mReversi.getBetCnt(ReversiConst.REVERSI_STS_BLACK);
                whi = this.mReversi.getBetCnt(ReversiConst.REVERSI_STS_WHITE);
                tmpMsg1 =
                    "プレイヤー1 = " + String(blk) + " プレイヤー2 = " + String(whi);
                if (this.mSetting.mMode == ReversiConst.DEF_MODE_ONE) {
                    if (whi == blk)
                        tmpMsg2 = "引き分けです。";
                    else if (whi < blk) {
                        if (this.mCurColor == ReversiConst.REVERSI_STS_BLACK)
                            tmpMsg2 = "あなたの勝ちです。";
                        else
                            tmpMsg2 = "あなたの負けです。";
                    }
                    else {
                        if (this.mCurColor == ReversiConst.REVERSI_STS_WHITE)
                            tmpMsg2 = "あなたの勝ちです。";
                        else
                            tmpMsg2 = "あなたの負けです。";
                    }
                }
                else {
                    if (whi == blk)
                        tmpMsg2 = "引き分けです。";
                    else if (whi < blk)
                        tmpMsg2 = "プレイヤー1の勝ちです。";
                    else
                        tmpMsg2 = "プレイヤー2の勝ちです。";
                }
                msgStr = tmpMsg1 + tmpMsg2;
                this.viewMsgDlg("ゲーム終了", msgStr);
                if (this.mSetting.mEndAnim == ReversiConst.DEF_END_ANIM_ON) {
                    this.execMessage(LC_MSG_CUR_COL, null);
                    this.execMessage(LC_MSG_CUR_STS, null);
                }
            }
        };
        ReversiPlay.prototype.reversiPlayPass = function (color) {
            if (this.mSetting.mMode == ReversiConst.DEF_MODE_ONE) {
                if (color == this.mCurColor)
                    this.viewMsgDlg("", "あなたはパスです。");
                else
                    this.viewMsgDlg("", "CPUはパスです。");
            }
            else {
                if (color == ReversiConst.REVERSI_STS_BLACK)
                    this.viewMsgDlg("", "プレイヤー1はパスです。");
                else
                    this.viewMsgDlg("", "プレイヤー2はパスです。");
            }
        };
        ReversiPlay.prototype.reversiPlayCpu = function (color, cpuEna) {
            var update = 0;
            var setY;
            var setX;
            for (;;) {
                if (cpuEna == 1) {
                    cpuEna = 0;
                    var pCnt = this.mReversi.getPointCnt(color);
                    var pInfo = this.mReversi.getPoint(color, Math.floor(Math.random() * pCnt));
                    if (pInfo != null) {
                        setY = pInfo.y;
                        setX = pInfo.x;
                        if (this.mSetting.mType != ReversiConst.DEF_TYPE_EASY) {
                            var cpuflg0, cpuflg1, cpuflg2, cpuflg3, mem, mem2, mem3, mem4, rcnt1, rcnt2, kadocnt, loop, pcnt, passCnt, othColor, othBet, ownBet, endZone;
                            cpuflg0 = 0;
                            cpuflg1 = 0;
                            cpuflg2 = 0;
                            cpuflg3 = 0;
                            mem = -1;
                            mem2 = -1;
                            mem3 = -1;
                            mem4 = -1;
                            rcnt1 = 0;
                            rcnt2 = 0;
                            kadocnt = 0;
                            loop = this.mSetting.mMasuCnt * this.mSetting.mMasuCnt;
                            pcnt = 0;
                            passCnt = 0;
                            if (color == ReversiConst.REVERSI_STS_BLACK)
                                othColor = ReversiConst.REVERSI_STS_WHITE;
                            else
                                othColor = ReversiConst.REVERSI_STS_BLACK;
                            othBet = this.mReversi.getBetCnt(othColor);
                            ownBet = this.mReversi.getBetCnt(color);
                            endZone = 0;
                            if (loop - (othBet + ownBet) <= 16)
                                endZone = 1;
                            for (var i = 0; i < loop; i++) {
                                this.mCpu[i].x = 0;
                                this.mCpu[i].y = 0;
                                this.mEdge[i].x = 0;
                                this.mEdge[i].y = 0;
                            }
                            for (var i = 0; i < this.mSetting.mMasuCnt; i++) {
                                for (var j = 0; j < this.mSetting.mMasuCnt; j++) {
                                    if (this.mReversi.getMasuStsEna(color, i, j) != 0) {
                                        if (this.mReversi.getEdgeSideOne(i, j) == 0) {
                                            this.mEdge[kadocnt].x = j;
                                            this.mEdge[kadocnt].y = i;
                                            kadocnt++;
                                        }
                                        else {
                                            this.mCpu[rcnt1].x = j;
                                            this.mCpu[rcnt1].y = i;
                                            rcnt1++;
                                        }
                                        if (this.mSetting.mType == ReversiConst.DEF_TYPE_NOR) {
                                            if (this.mReversi.getEdgeSideZero(i, j) == 0) {
                                                cpuflg1 = 1;
                                                rcnt2 = rcnt1 - 1;
                                            }
                                            if (cpuflg1 == 0) {
                                                if (this.mReversi.getEdgeSideTwo(i, j) == 0) {
                                                    cpuflg2 = 1;
                                                    rcnt2 = rcnt1 - 1;
                                                }
                                            }
                                            if (cpuflg1 == 0 && cpuflg2 == 0) {
                                                if (this.mReversi.getEdgeSideThree(i, j) == 0) {
                                                    cpuflg0 = 1;
                                                    rcnt2 = rcnt1 - 1;
                                                }
                                            }
                                        }
                                        if (this.mReversi.getMasuStsCnt(color, i, j) == othBet) {
                                            setY = i;
                                            setX = j;
                                            pcnt = 1;
                                        }
                                        if (pcnt == 0) {
                                            if (this.mReversi.getPassEna(color, i, j) != 0) {
                                                setY = i;
                                                setX = j;
                                                passCnt = 1;
                                            }
                                        }
                                    }
                                }
                            }
                            if (pcnt == 0 && passCnt == 0) {
                                var badPoint = -1;
                                var goodPoint = -1;
                                var pointCnt = -1;
                                var ownPointCnt = -1;
                                var tmpAnz;
                                if (rcnt1 != 0) {
                                    for (var i = 0; i < rcnt1; i++) {
                                        if (this.mSetting.mType == ReversiConst.DEF_TYPE_HARD) {
                                            tmpAnz = this.mReversi.getPointAnz(color, this.mCpu[i].y, this.mCpu[i].x);
                                            if (tmpAnz != null) {
                                                if (badPoint == -1) {
                                                    badPoint = tmpAnz.badPoint;
                                                    goodPoint = tmpAnz.goodPoint;
                                                    pointCnt = tmpAnz.pointCnt;
                                                    ownPointCnt = tmpAnz.ownPointCnt;
                                                    mem2 = i;
                                                    mem3 = i;
                                                    mem4 = i;
                                                }
                                                else {
                                                    if (tmpAnz.badPoint < badPoint) {
                                                        badPoint = tmpAnz.badPoint;
                                                        mem2 = i;
                                                    }
                                                    if (goodPoint < tmpAnz.goodPoint) {
                                                        goodPoint = tmpAnz.goodPoint;
                                                        mem3 = i;
                                                    }
                                                    if (tmpAnz.pointCnt < pointCnt) {
                                                        pointCnt = tmpAnz.pointCnt;
                                                        ownPointCnt = tmpAnz.ownPointCnt;
                                                        mem4 = i;
                                                    }
                                                    else if (tmpAnz.pointCnt == pointCnt) {
                                                        if (ownPointCnt < tmpAnz.ownPointCnt) {
                                                            ownPointCnt = tmpAnz.ownPointCnt;
                                                            mem4 = i;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        if (this.mReversi.getMasuStsEna(color, this.mCpu[i].y, this.mCpu[i].x) == 2) {
                                            mem = i;
                                        }
                                    }
                                    if (mem2 != -1) {
                                        if (endZone != 0) {
                                            if (mem3 != -1) {
                                                mem2 = mem3;
                                            }
                                        }
                                        else {
                                            if (mem4 != -1) {
                                                mem2 = mem4;
                                            }
                                        }
                                        mem = mem2;
                                    }
                                    if (mem == -1)
                                        mem = Math.floor(Math.random() * rcnt1);
                                }
                                else if (kadocnt != 0) {
                                    for (var i = 0; i < kadocnt; i++) {
                                        if (this.mSetting.mType == ReversiConst.DEF_TYPE_HARD) {
                                            tmpAnz = this.mReversi.getPointAnz(color, this.mEdge[i].y, this.mEdge[i].x);
                                            if (tmpAnz != null) {
                                                if (badPoint == -1) {
                                                    badPoint = tmpAnz.badPoint;
                                                    goodPoint = tmpAnz.goodPoint;
                                                    pointCnt = tmpAnz.pointCnt;
                                                    ownPointCnt = tmpAnz.ownPointCnt;
                                                    mem2 = i;
                                                    mem3 = i;
                                                    mem4 = i;
                                                }
                                                else {
                                                    if (tmpAnz.badPoint < badPoint) {
                                                        badPoint = tmpAnz.badPoint;
                                                        mem2 = i;
                                                    }
                                                    if (goodPoint < tmpAnz.goodPoint) {
                                                        goodPoint = tmpAnz.goodPoint;
                                                        mem3 = i;
                                                    }
                                                    if (tmpAnz.pointCnt < pointCnt) {
                                                        pointCnt = tmpAnz.pointCnt;
                                                        ownPointCnt = tmpAnz.ownPointCnt;
                                                        mem4 = i;
                                                    }
                                                    else if (tmpAnz.pointCnt == pointCnt) {
                                                        if (ownPointCnt < tmpAnz.ownPointCnt) {
                                                            ownPointCnt = tmpAnz.ownPointCnt;
                                                            mem4 = i;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        if (this.mReversi.getMasuStsEna(color, this.mEdge[i].y, this.mEdge[i].x) == 2) {
                                            mem = i;
                                        }
                                    }
                                    if (mem2 != -1) {
                                        if (endZone != 0) {
                                            if (mem3 != -1) {
                                                mem2 = mem3;
                                            }
                                        }
                                        else {
                                            if (mem4 != -1) {
                                                mem2 = mem4;
                                            }
                                        }
                                        mem = mem2;
                                    }
                                    if (mem == -1)
                                        mem = Math.floor(Math.random() * kadocnt);
                                    for (var i = 0; i < kadocnt; i++) {
                                        if (this.mReversi.checkEdge(color, this.mEdge[i].y, this.mEdge[i].x) != 0) {
                                            if (cpuflg0 == 0 && cpuflg1 == 0 && cpuflg2 == 0) {
                                                cpuflg3 = 1;
                                                rcnt2 = i;
                                            }
                                        }
                                    }
                                }
                                if (cpuflg1 == 0 &&
                                    cpuflg2 == 0 &&
                                    cpuflg0 == 0 &&
                                    cpuflg3 == 0) {
                                    rcnt2 = mem;
                                }
                                if (rcnt1 != 0) {
                                    setY = this.mCpu[rcnt2].y;
                                    setX = this.mCpu[rcnt2].x;
                                }
                                else if (kadocnt != 0) {
                                    setY = this.mEdge[rcnt2].y;
                                    setX = this.mEdge[rcnt2].x;
                                }
                            }
                        }
                        if (this.mReversi.setMasuSts(color, setY, setX) == 0) {
                            if (this.mSetting.mType == ReversiConst.DEF_TYPE_HARD)
                                this.mReversi.AnalysisReversi(this.mPassEnaB, this.mPassEnaW);
                            this.sendDrawMsg(setY, setX);
                            update = 1;
                        }
                    }
                }
                else {
                    break;
                }
            }
            if (update == 1) {
                this.drawUpdate(ReversiConst.DEF_ASSIST_OFF);
                if (this.mSetting.mAssist == ReversiConst.DEF_ASSIST_ON) {
                    this.execMessage(LC_MSG_DRAW_INFO_ALL, null);
                }
            }
            return update;
        };
        ReversiPlay.prototype.drawUpdate = function (assist) {
            if (assist == ReversiConst.DEF_ASSIST_ON) {
                for (var i = 0; i < this.mSetting.mMasuCnt; i++) {
                    for (var j = 0; j < this.mSetting.mMasuCnt; j++) {
                        this.sendDrawInfoMsg(i, j);
                    }
                }
            }
            var waitTime = this.mSetting.mPlayDrawInterVal;
            for (var i = 0; i < this.mSetting.mMasuCnt; i++) {
                for (var j = 0; j < this.mSetting.mMasuCnt; j++) {
                    if (this.mReversi.getMasuSts(i, j) != this.mReversi.getMasuStsOld(i, j)) {
                        this.wait(waitTime);
                        this.sendDrawMsg(i, j);
                    }
                }
            }
            this.execMessage(LC_MSG_CUR_COL, null);
            this.execMessage(LC_MSG_CUR_STS, null);
        };
        ReversiPlay.prototype.drawUpdateForcibly = function (assist) {
            this.execMessage(LC_MSG_DRAW_ALL, null);
            if (assist == ReversiConst.DEF_ASSIST_ON) {
                this.execMessage(LC_MSG_DRAW_INFO_ALL, null);
            }
            else {
                this.execMessage(LC_MSG_ERASE_INFO_ALL, null);
            }
            this.execMessage(LC_MSG_CUR_COL, null);
            this.execMessage(LC_MSG_CUR_STS, null);
        };
        ReversiPlay.prototype.reset = function () {
            this.mPassEnaB = 0;
            this.mPassEnaW = 0;
            if (this.mSetting.mGameSpd == ReversiConst.DEF_GAME_SPD_FAST) {
                this.mSetting.mPlayDrawInterVal = ReversiConst.DEF_GAME_SPD_FAST_VAL;
                this.mSetting.mPlayCpuInterVal = ReversiConst.DEF_GAME_SPD_FAST_VAL2;
            }
            else if (this.mSetting.mGameSpd == ReversiConst.DEF_GAME_SPD_MID) {
                this.mSetting.mPlayDrawInterVal = ReversiConst.DEF_GAME_SPD_MID_VAL;
                this.mSetting.mPlayCpuInterVal = ReversiConst.DEF_GAME_SPD_MID_VAL2;
            }
            else {
                this.mSetting.mPlayDrawInterVal = ReversiConst.DEF_GAME_SPD_SLOW_VAL;
                this.mSetting.mPlayCpuInterVal = ReversiConst.DEF_GAME_SPD_SLOW_VAL2;
            }
            this.mCurColor = this.mSetting.mPlayer;
            if (this.mSetting.mMode == ReversiConst.DEF_MODE_TWO)
                this.mCurColor = ReversiConst.REVERSI_STS_BLACK;
            this.mReversi.setMasuCnt(this.mSetting.mMasuCnt);
            this.mReversi.reset();
            if (this.mSetting.mMode == ReversiConst.DEF_MODE_ONE) {
                if (this.mCurColor == ReversiConst.REVERSI_STS_WHITE) {
                    var pCnt = this.mReversi.getPointCnt(ReversiConst.REVERSI_STS_BLACK);
                    var pInfo = this.mReversi.getPoint(ReversiConst.REVERSI_STS_BLACK, Math.floor(Math.random() * pCnt));
                    if (pInfo != null) {
                        this.mReversi.setMasuSts(ReversiConst.REVERSI_STS_BLACK, pInfo.y, pInfo.x);
                        if (this.mSetting.mType == ReversiConst.DEF_TYPE_HARD)
                            this.mReversi.AnalysisReversi(this.mPassEnaB, this.mPassEnaW);
                    }
                }
            }
            this.mPlayLock = 1;
            this.mGameEndSts = 0;
            this.drawUpdateForcibly(this.mSetting.mAssist);
            this.execMessage(LC_MSG_DRAW_END, null);
        };
        ReversiPlay.prototype.gameEndAnimExec = function () {
            var bCnt, wCnt, offsetCnt = 2;
            var ret = 0;
            if (this.mSetting.mEndAnim == ReversiConst.DEF_END_ANIM_ON) {
                bCnt = this.mReversi.getBetCnt(ReversiConst.REVERSI_STS_BLACK);
                wCnt = this.mReversi.getBetCnt(ReversiConst.REVERSI_STS_WHITE);
                this.execMessage(LC_MSG_CUR_COL_ERASE, null);
                this.execMessage(LC_MSG_CUR_STS_ERASE, null);
                this.wait(this.mSetting.mEndInterVal);
                for (var i = 0; i < this.mSetting.mMasuCnt; i++) {
                    for (var j = 0; j < this.mSetting.mMasuCnt; j++) {
                        this.mReversi.setMasuStsForcibly(ReversiConst.REVERSI_STS_NONE, i, j);
                    }
                }
                this.execMessage(LC_MSG_ERASE_ALL, null);
                var bCnt2, wCnt2, bEnd, wEnd;
                bCnt2 = 0;
                wCnt2 = 0;
                bEnd = 0;
                wEnd = 0;
                var waitTime = this.mSetting.mEndDrawInterVal;
                for (var i = 0; i < this.mSetting.mMasuCnt; i++) {
                    for (var j = 0; j < this.mSetting.mMasuCnt; j++) {
                        if (bCnt2 < bCnt) {
                            bCnt2++;
                            this.mReversi.setMasuStsForcibly(ReversiConst.REVERSI_STS_BLACK, i, j);
                            this.sendDrawMsg(i, j);
                        }
                        else {
                            bEnd = 1;
                        }
                        if (wCnt2 < wCnt) {
                            wCnt2++;
                            this.mReversi.setMasuStsForcibly(ReversiConst.REVERSI_STS_WHITE, this.mSetting.mMasuCnt - 1 - i, this.mSetting.mMasuCnt - 1 - j);
                            this.sendDrawMsg(this.mSetting.mMasuCnt - 1 - i, this.mSetting.mMasuCnt - 1 - j);
                        }
                        else {
                            wEnd = 1;
                        }
                        if (bEnd == 1 && wEnd == 1) {
                            break;
                        }
                        else {
                            this.wait(this.mSetting.mEndDrawInterVal);
                        }
                    }
                }
                ret = this.mSetting.mEndInterVal;
            }
            return ret;
        };
        ReversiPlay.prototype.sendDrawMsg = function (y, x) {
            var mTmpPoint = new ReversiPoint();
            mTmpPoint.y = y;
            mTmpPoint.x = x;
            this.execMessage(LC_MSG_DRAW, mTmpPoint);
        };
        ReversiPlay.prototype.sendDrawInfoMsg = function (y, x) {
            var mTmpPoint = new ReversiPoint();
            mTmpPoint.y = y;
            mTmpPoint.x = x;
            this.execMessage(LC_MSG_DRAW_INFO, mTmpPoint);
        };
        ReversiPlay.prototype.viewMsgDlg = function (title, msg) {
            if (this.mDelegate != null && this.mCallbacks != null) {
                this.mCallbacks.Funcs.push(this.mDelegate.viewMsgDlg(title, msg));
            }
        };
        ReversiPlay.prototype.drawSingle = function (y, x, sts, bk, text) {
            if (this.mDelegate != null && this.mCallbacks != null) {
                if (text == "0")
                    text = "";
                this.mCallbacks.Funcs.push(this.mDelegate.drawSingle(y, x, sts, bk, text));
            }
        };
        ReversiPlay.prototype.curColMsg = function (text) {
            if (this.mDelegate != null && this.mCallbacks != null) {
                this.mCallbacks.Funcs.push(this.mDelegate.curColMsg(text));
            }
        };
        ReversiPlay.prototype.curStsMsg = function (text) {
            if (this.mDelegate != null && this.mCallbacks != null) {
                this.mCallbacks.Funcs.push(this.mDelegate.curStsMsg(text));
            }
        };
        ReversiPlay.prototype.wait = function (time) {
            if (this.mDelegate != null && this.mCallbacks != null) {
                this.mCallbacks.Funcs.push(this.mDelegate.wait(time));
            }
        };
        ReversiPlay.prototype.execMessage = function (what, obj) {
            var dMode, dBack, dCnt, exec = 0;
            if (what == LC_MSG_DRAW) {
                var msgPoint = obj;
                dMode = this.mReversi.getMasuSts(msgPoint.y, msgPoint.x);
                dBack = this.mReversi.getMasuStsEna(this.mCurColor, msgPoint.y, msgPoint.x);
                dCnt = this.mReversi.getMasuStsCnt(this.mCurColor, msgPoint.y, msgPoint.x);
                this.drawSingle(msgPoint.y, msgPoint.x, dMode, dBack, String(dCnt));
            }
            else if (what == LC_MSG_ERASE) {
                var msgPoint = obj;
                this.drawSingle(msgPoint.y, msgPoint.x, 0, 0, String(0));
            }
            else if (what == LC_MSG_DRAW_INFO) {
                var msgPoint = obj;
                dMode = this.mReversi.getMasuSts(msgPoint.y, msgPoint.x);
                dBack = this.mReversi.getMasuStsEna(this.mCurColor, msgPoint.y, msgPoint.x);
                dCnt = this.mReversi.getMasuStsCnt(this.mCurColor, msgPoint.y, msgPoint.x);
                this.drawSingle(msgPoint.y, msgPoint.x, dMode, dBack, String(dCnt));
            }
            else if (what == LC_MSG_ERASE_INFO) {
                var msgPoint = obj;
                dMode = this.mReversi.getMasuSts(msgPoint.y, msgPoint.x);
                this.drawSingle(msgPoint.y, msgPoint.x, dMode, 0, String(0));
            }
            else if (what == LC_MSG_DRAW_ALL) {
                for (var i = 0; i < this.mSetting.mMasuCnt; i++) {
                    for (var j = 0; j < this.mSetting.mMasuCnt; j++) {
                        dMode = this.mReversi.getMasuSts(i, j);
                        dBack = this.mReversi.getMasuStsEna(this.mCurColor, i, j);
                        dCnt = this.mReversi.getMasuStsCnt(this.mCurColor, i, j);
                        this.drawSingle(i, j, dMode, dBack, String(dCnt));
                    }
                }
            }
            else if (what == LC_MSG_ERASE_ALL) {
                for (var i = 0; i < this.mSetting.mMasuCnt; i++) {
                    for (var j = 0; j < this.mSetting.mMasuCnt; j++) {
                        this.drawSingle(i, j, 0, 0, String(0));
                    }
                }
            }
            else if (what == LC_MSG_DRAW_INFO_ALL) {
                for (var i = 0; i < this.mSetting.mMasuCnt; i++) {
                    for (var j = 0; j < this.mSetting.mMasuCnt; j++) {
                        dMode = this.mReversi.getMasuSts(i, j);
                        dBack = this.mReversi.getMasuStsEna(this.mCurColor, i, j);
                        dCnt = this.mReversi.getMasuStsCnt(this.mCurColor, i, j);
                        this.drawSingle(i, j, dMode, dBack, String(dCnt));
                    }
                }
            }
            else if (what == LC_MSG_ERASE_INFO_ALL) {
                for (var i = 0; i < this.mSetting.mMasuCnt; i++) {
                    for (var j = 0; j < this.mSetting.mMasuCnt; j++) {
                        dMode = this.mReversi.getMasuSts(i, j);
                        this.drawSingle(i, j, dMode, 0, String(0));
                    }
                }
            }
            else if (what == LC_MSG_DRAW_END) {
                this.mPlayLock = 0;
            }
            else if (what == LC_MSG_CUR_COL) {
                var tmpStr = "";
                if (this.mSetting.mMode == ReversiConst.DEF_MODE_ONE) {
                    if (this.mCurColor == ReversiConst.REVERSI_STS_BLACK)
                        tmpStr = "あなたはプレイヤー1です ";
                    else
                        tmpStr = "あなたはプレイヤー2です ";
                }
                else {
                    if (this.mCurColor == ReversiConst.REVERSI_STS_BLACK)
                        tmpStr = "プレイヤー1の番です ";
                    else
                        tmpStr = "プレイヤー2の番です ";
                }
                this.curColMsg(tmpStr);
            }
            else if (what == LC_MSG_CUR_COL_ERASE) {
                this.curColMsg("");
            }
            else if (what == LC_MSG_CUR_STS) {
                var tmpStr = "プレイヤー1 = " +
                    this.mReversi.getBetCnt(ReversiConst.REVERSI_STS_BLACK) +
                    " プレイヤー2 = " +
                    this.mReversi.getBetCnt(ReversiConst.REVERSI_STS_WHITE);
                this.curStsMsg(tmpStr);
            }
            else if (what == LC_MSG_CUR_STS_ERASE) {
                this.curStsMsg("");
            }
            else if (what == LC_MSG_MSG_DLG) {
            }
            else if (what == LC_MSG_DRAW_ALL_RESET) {
            }
        };
        ReversiPlay.prototype.setSetting = function (mSetting) {
            this.mSetting = mSetting;
        };
        ReversiPlay.prototype.getetSetting = function () {
            return this.mSetting;
        };
        ReversiPlay.prototype.setmDelegate = function (mDelegate) {
            this.mDelegate = mDelegate;
        };
        ReversiPlay.prototype.getmDelegate = function () {
            return this.mDelegate;
        };
        ReversiPlay.prototype.setmCallbacks = function (mCallbacks) {
            this.mCallbacks = mCallbacks;
        };
        ReversiPlay.prototype.getmCallbacks = function () {
            return this.mCallbacks;
        };
        ReversiPlay.prototype.setSession = function (session) {
            this.mReversi.setSession(session.mReversi);
            this.mSetting = session.mSetting;
            this.mCurColor = session.mCurColor;
            this.mCpu = session.mCpu;
            this.mEdge = session.mEdge;
            this.mPassEnaB = session.mPassEnaB;
            this.mPassEnaW = session.mPassEnaW;
            this.mGameEndSts = session.mGameEndSts;
            this.mPlayLock = session.mPlayLock;
            this.mDelegate = session.mDelegate;
            this.mCallbacks = session.mCallbacks;
        };
        return ReversiPlay;
    }());
})(ReversiPlayWrap || (ReversiPlayWrap = {}));
//# sourceMappingURL=ReversiPlay.js.map