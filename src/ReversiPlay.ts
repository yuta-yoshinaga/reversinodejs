////////////////////////////////////////////////////////////////////////////////
/**	@file			ReversiPlay.ts
 *	@brief			リバーシプレイクラス実装ファイル
 *	@author			Yuta Yoshinaga
 *	@date			2017.06.01
 *	$Version:		$
 *	$Revision:		$
 *
 * (c) 2017 Yuta Yoshinaga.
 *
 * - 本ソフトウェアの一部又は全てを無断で複写複製（コピー）することは、
 *   著作権侵害にあたりますので、これを禁止します。
 * - 本製品の使用に起因する侵害または特許権その他権利の侵害に関しては
 *   当方は一切その責任を負いません。
 */
////////////////////////////////////////////////////////////////////////////////

var LC_MSG_DRAW = 0; //!< マス描画
var LC_MSG_ERASE = 1; //!< マス消去
var LC_MSG_DRAW_INFO = 2; //!< マス情報描画
var LC_MSG_ERASE_INFO = 3; //!< マス情報消去
var LC_MSG_DRAW_ALL = 4; //!< 全マス描画
var LC_MSG_ERASE_ALL = 5; //!< 全マス消去
var LC_MSG_DRAW_INFO_ALL = 6; //!< 全マス情報描画
var LC_MSG_ERASE_INFO_ALL = 7; //!< 全マス情報消去
var LC_MSG_DRAW_END = 8; //!< 描画終わり
var LC_MSG_CUR_COL = 9; //!< 現在の色
var LC_MSG_CUR_COL_ERASE = 10; //!< 現在の色消去
var LC_MSG_CUR_STS = 11; //!< 現在のステータス
var LC_MSG_CUR_STS_ERASE = 12; //!< 現在のステータス消去
var LC_MSG_MSG_DLG = 13; //!< メッセージダイアログ
var LC_MSG_DRAW_ALL_RESET = 14; //!< 全マスビットマップインスタンスクリア

let ReversiAnz = require("./ReversiAnz");
let ReversiPoint = require("./ReversiPoint");
let ReversiConst = require("./ReversiConst");
let Reversi = require("./Reversi");
let ReversiSetting = require("./ReversiSetting");

////////////////////////////////////////////////////////////////////////////////
/**	@class		ReversiPlay
 *	@brief		リバーシプレイクラス
 */
////////////////////////////////////////////////////////////////////////////////
module.exports = class ReversiPlay {
  private mReversi: typeof Reversi; //!< リバーシクラス
  private mSetting: typeof ReversiSetting; //!< リバーシ設定クラス

  private mCurColor: number = 0; //!< 現在の色

  private mCpu: typeof ReversiPoint[]; //!< CPU用ワーク
  private mEdge: typeof ReversiPoint[]; //!< CPU用角マスワーク

  private mPassEnaB: number = 0; //!< 黒のパス有効フラグ
  private mPassEnaW: number = 0; //!< 白のパス有効フラグ

  private mGameEndSts: number = 0; //!< ゲーム終了ステータス
  private mPlayLock: number = 0; //!< プレイロック

  private viewMsgDlgFunc: any = null; //!< メッセージコールバック
  private drawSingleFunc: any = null; //!< 描画コールバック
  private curColMsgFunc: any = null; //!< 現在の色メッセージコールバック
  private curStsMsgFunc: any = null; //!< 現在のステータスメッセージコールバック

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief			コンストラクタ
   *	@fn				public constructor()
   *	@return			ありません
   *	@author			Yuta Yoshinaga
   *	@date			2017.06.01
   */
  ////////////////////////////////////////////////////////////////////////////////
  public constructor() {
    this.mReversi = new Reversi(
      ReversiConst.DEF_MASU_CNT_MAX_VAL,
      ReversiConst.DEF_MASU_CNT_MAX_VAL
    );
    this.mSetting = new ReversiSetting();
    this.mCpu = new Array();
    this.mEdge = new Array();
    for (
      var i = 0;
      i < ReversiConst.DEF_MASU_CNT_MAX_VAL * ReversiConst.DEF_MASU_CNT_MAX_VAL;
      i++
    ) {
      this.mCpu[i] = new ReversiPoint();
      this.mEdge[i] = new ReversiPoint();
    }
    this.reset();
  }

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief			リバーシプレイ
   *	@fn				public reversiPlay(y : number, x : number) : void
   *	@param[in]		y : number			Y座標
   *	@param[in]		x : number			X座標
   *	@return			ありません
   *	@author			Yuta Yoshinaga
   *	@date			2017.06.01
   */
  ////////////////////////////////////////////////////////////////////////////////
  public reversiPlay(y: number, x: number): void {
    var update: number = 0;
    var cpuEna: number = 0;
    var tmpCol: number = this.mCurColor;
    var ret: number;
    var pass: number = 0;

    if (this.mPlayLock == 1) return;
    this.mPlayLock = 1;
    if (this.mReversi.getColorEna(this.mCurColor) == 0) {
      if (this.mReversi.setMasuSts(this.mCurColor, y, x) == 0) {
        if (this.mSetting.mType == ReversiConst.DEF_TYPE_HARD)
          this.mReversi.AnalysisReversi(this.mPassEnaB, this.mPassEnaW);
        if (this.mSetting.mAssist == ReversiConst.DEF_ASSIST_ON) {
          // *** メッセージ送信 *** //
          this.execMessage(LC_MSG_ERASE_INFO_ALL, null);
        }
        this.sendDrawMsg(y, x); // 描画
        this.drawUpdate(ReversiConst.DEF_ASSIST_OFF); // その他コマ描画
        if (this.mReversi.getGameEndSts() == 0) {
          if (tmpCol == ReversiConst.REVERSI_STS_BLACK)
            tmpCol = ReversiConst.REVERSI_STS_WHITE;
          else tmpCol = ReversiConst.REVERSI_STS_BLACK;
          if (this.mReversi.getColorEna(tmpCol) == 0) {
            if (this.mSetting.mMode == ReversiConst.DEF_MODE_ONE) {
              // CPU対戦
              cpuEna = 1;
            } else {
              // 二人対戦
              this.mCurColor = tmpCol;
              this.drawUpdate(this.mSetting.mAssist); // 次のプレイヤーコマ描画
            }
          } else {
            // *** パスメッセージ *** //
            this.reversiPlayPass(tmpCol);
            pass = 1;
          }
        } else {
          // *** ゲーム終了メッセージ *** //
          this.reversiPlayEnd();
        }
        update = 1;
      } else {
        // *** エラーメッセージ *** //
        this.viewMsgDlg("エラー", "そのマスには置けません。");
      }
    } else {
      if (this.mReversi.getGameEndSts() == 0) {
        if (tmpCol == ReversiConst.REVERSI_STS_BLACK)
          tmpCol = ReversiConst.REVERSI_STS_WHITE;
        else tmpCol = ReversiConst.REVERSI_STS_BLACK;
        if (this.mReversi.getColorEna(tmpCol) == 0) {
          if (this.mSetting.mMode == ReversiConst.DEF_MODE_ONE) {
            // CPU対戦
            update = 1;
            cpuEna = 1;
          } else {
            // 二人対戦
            this.mCurColor = tmpCol;
          }
        } else {
          // *** パスメッセージ *** //
          this.reversiPlayPass(tmpCol);
          pass = 1;
        }
      } else {
        // *** ゲーム終了メッセージ *** //
        this.reversiPlayEnd();
      }
    }
    if (pass == 1) {
      if (this.mSetting.mMode == ReversiConst.DEF_MODE_ONE) {
        // CPU対戦
        if (this.mSetting.mAssist == ReversiConst.DEF_ASSIST_ON) {
          // *** メッセージ送信 *** //
          this.execMessage(LC_MSG_DRAW_INFO_ALL, null);
        }
      }
    }
    if (update == 1) {
      var waitTime = 0;
      if (cpuEna == 1) {
        waitTime = this.mSetting.mPlayCpuInterVal;
      }
      var _this = this;
      setTimeout(
        function (cpuEna, tmpCol) {
          _this.reversiPlaySub(cpuEna, tmpCol);
          _this.mPlayLock = 0;
        },
        waitTime,
        cpuEna,
        tmpCol
      );
    } else {
      this.mPlayLock = 0;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief			リバーシプレイサブ
   *	@fn				public reversiPlaySub(cpuEna: number, tmpCol: number): void
   *	@param[in]		cpuEna : number
   *	@param[in]		tmpCol : number
   *	@return			ありません
   *	@author			Yuta Yoshinaga
   *	@date			2017.06.01
   */
  ////////////////////////////////////////////////////////////////////////////////
  public reversiPlaySub(cpuEna: number, tmpCol: number): void {
    var ret: number;
    for (;;) {
      ret = this.reversiPlayCpu(tmpCol, cpuEna);
      cpuEna = 0;
      if (ret == 1) {
        if (this.mReversi.getGameEndSts() == 0) {
          if (this.mReversi.getColorEna(this.mCurColor) != 0) {
            // *** パスメッセージ *** //
            this.reversiPlayPass(this.mCurColor);
            cpuEna = 1;
          }
        } else {
          // *** ゲーム終了メッセージ *** //
          this.reversiPlayEnd();
        }
      }
      if (cpuEna == 0) break;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief			リバーシプレイ終了
   *	@fn				public reversiPlayEnd() : void
   *	@return			ありません
   *	@author			Yuta Yoshinaga
   *	@date			2017.06.01
   */
  ////////////////////////////////////////////////////////////////////////////////
  public reversiPlayEnd(): void {
    if (this.mGameEndSts == 0) {
      this.mGameEndSts = 1;
      var waitTime = this.gameEndAnimExec(); // 終了アニメ実行
      var _this = this;
      this.mPlayLock = 1;
      setTimeout(function () {
        // *** ゲーム終了メッセージ *** //
        var tmpMsg1, tmpMsg2, msgStr;
        var blk, whi;
        blk = _this.mReversi.getBetCnt(ReversiConst.REVERSI_STS_BLACK);
        whi = _this.mReversi.getBetCnt(ReversiConst.REVERSI_STS_WHITE);
        tmpMsg1 =
          "プレイヤー1 = " + String(blk) + " プレイヤー2 = " + String(whi);
        if (_this.mSetting.mMode == ReversiConst.DEF_MODE_ONE) {
          if (whi == blk) tmpMsg2 = "引き分けです。";
          else if (whi < blk) {
            if (_this.mCurColor == ReversiConst.REVERSI_STS_BLACK)
              tmpMsg2 = "あなたの勝ちです。";
            else tmpMsg2 = "あなたの負けです。";
          } else {
            if (_this.mCurColor == ReversiConst.REVERSI_STS_WHITE)
              tmpMsg2 = "あなたの勝ちです。";
            else tmpMsg2 = "あなたの負けです。";
          }
        } else {
          if (whi == blk) tmpMsg2 = "引き分けです。";
          else if (whi < blk) tmpMsg2 = "プレイヤー1の勝ちです。";
          else tmpMsg2 = "プレイヤー2の勝ちです。";
        }
        msgStr = tmpMsg1 + tmpMsg2;
        _this.viewMsgDlg("ゲーム終了", msgStr);

        if (_this.mSetting.mEndAnim == ReversiConst.DEF_END_ANIM_ON) {
          // *** メッセージ送信 *** //
          _this.execMessage(LC_MSG_CUR_COL, null);
          // *** メッセージ送信 *** //
          _this.execMessage(LC_MSG_CUR_STS, null);
        }
      }, waitTime);
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief			リバーシプレイパス
   *	@fn				public reversiPlayPass(color : number) : void
   *	@param[in]		color : number		パス色
   *	@return			ありません
   *	@author			Yuta Yoshinaga
   *	@date			2017.06.01
   */
  ////////////////////////////////////////////////////////////////////////////////
  public reversiPlayPass(color: number): void {
    // *** パスメッセージ *** //
    if (this.mSetting.mMode == ReversiConst.DEF_MODE_ONE) {
      if (color == this.mCurColor) this.viewMsgDlg("", "あなたはパスです。");
      else this.viewMsgDlg("", "CPUはパスです。");
    } else {
      if (color == ReversiConst.REVERSI_STS_BLACK)
        this.viewMsgDlg("", "プレイヤー1はパスです。");
      else this.viewMsgDlg("", "プレイヤー2はパスです。");
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief			リバーシプレイコンピューター
   *	@fn				public reversiPlayCpu(color : number,cpuEna : number) : number
   *	@param[in]		color : number		CPU色
   *	@param[in]		cpuEna : number		CPU有効フラグ
   *	@return			ありません
   *	@author			Yuta Yoshinaga
   *	@date			2014.06.26
   */
  ////////////////////////////////////////////////////////////////////////////////
  public reversiPlayCpu(color: number, cpuEna: number): number {
    var update: number = 0;
    var setY: number;
    var setX: number;

    for (;;) {
      if (cpuEna == 1) {
        cpuEna = 0;
        // *** CPU対戦 *** //
        var pCnt: number = this.mReversi.getPointCnt(color);
        var pInfo: typeof ReversiPoint = this.mReversi.getPoint(
          color,
          Math.floor(Math.random() * pCnt)
        );
        if (pInfo != null) {
          setY = pInfo.y;
          setX = pInfo.x;
          if (this.mSetting.mType != ReversiConst.DEF_TYPE_EASY) {
            // 強いコンピューター
            var cpuflg0,
              cpuflg1,
              cpuflg2,
              cpuflg3,
              mem,
              mem2,
              mem3,
              mem4,
              rcnt1,
              rcnt2,
              kadocnt,
              loop,
              pcnt,
              passCnt,
              othColor,
              othBet,
              ownBet,
              endZone;
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
            else othColor = ReversiConst.REVERSI_STS_BLACK;
            othBet = this.mReversi.getBetCnt(othColor); // 対戦相手のコマ数
            ownBet = this.mReversi.getBetCnt(color); // 自分のコマ数
            endZone = 0;
            if (loop - (othBet + ownBet) <= 16) endZone = 1; // ゲーム終盤フラグON
            for (var i = 0; i < loop; i++) {
              this.mCpu[i].x = 0;
              this.mCpu[i].y = 0;
              this.mEdge[i].x = 0;
              this.mEdge[i].y = 0;
            }

            for (var i = 0; i < this.mSetting.mMasuCnt; i++) {
              for (var j = 0; j < this.mSetting.mMasuCnt; j++) {
                if (this.mReversi.getMasuStsEna(color, i, j) != 0) {
                  // *** 角の一つ手前なら別のとこに格納 *** //
                  if (this.mReversi.getEdgeSideOne(i, j) == 0) {
                    this.mEdge[kadocnt].x = j;
                    this.mEdge[kadocnt].y = i;
                    kadocnt++;
                  } else {
                    this.mCpu[rcnt1].x = j;
                    this.mCpu[rcnt1].y = i;
                    rcnt1++;
                  }
                  if (this.mSetting.mType == ReversiConst.DEF_TYPE_NOR) {
                    // *** 角に置けるなら優先的にとらせるため場所を記憶させる *** //
                    if (this.mReversi.getEdgeSideZero(i, j) == 0) {
                      cpuflg1 = 1;
                      rcnt2 = rcnt1 - 1;
                    }
                    // *** 角の二つ手前も優先的にとらせるため場所を記憶させる *** //
                    if (cpuflg1 == 0) {
                      if (this.mReversi.getEdgeSideTwo(i, j) == 0) {
                        cpuflg2 = 1;
                        rcnt2 = rcnt1 - 1;
                      }
                    }
                    // *** 角の三つ手前も優先的にとらせるため場所を記憶させる *** //
                    if (cpuflg1 == 0 && cpuflg2 == 0) {
                      if (this.mReversi.getEdgeSideThree(i, j) == 0) {
                        cpuflg0 = 1;
                        rcnt2 = rcnt1 - 1;
                      }
                    }
                  }
                  // *** パーフェクトゲームなら *** //
                  if (this.mReversi.getMasuStsCnt(color, i, j) == othBet) {
                    setY = i;
                    setX = j;
                    pcnt = 1;
                  }
                  // *** 相手をパスさせるなら *** //
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
              var tmpAnz: typeof ReversiAnz;
              if (rcnt1 != 0) {
                for (var i = 0; i < rcnt1; i++) {
                  if (this.mSetting.mType == ReversiConst.DEF_TYPE_HARD) {
                    tmpAnz = this.mReversi.getPointAnz(
                      color,
                      this.mCpu[i].y,
                      this.mCpu[i].x
                    );
                    if (tmpAnz != null) {
                      if (badPoint == -1) {
                        badPoint = tmpAnz.badPoint;
                        goodPoint = tmpAnz.goodPoint;
                        pointCnt = tmpAnz.pointCnt;
                        ownPointCnt = tmpAnz.ownPointCnt;
                        mem2 = i;
                        mem3 = i;
                        mem4 = i;
                      } else {
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
                        } else if (tmpAnz.pointCnt == pointCnt) {
                          if (ownPointCnt < tmpAnz.ownPointCnt) {
                            ownPointCnt = tmpAnz.ownPointCnt;
                            mem4 = i;
                          }
                        }
                      }
                    }
                  }
                  if (
                    this.mReversi.getMasuStsEna(
                      color,
                      this.mCpu[i].y,
                      this.mCpu[i].x
                    ) == 2
                  ) {
                    mem = i;
                  }
                }
                if (mem2 != -1) {
                  if (endZone != 0) {
                    // 終盤なら枚数重視
                    if (mem3 != -1) {
                      mem2 = mem3;
                    }
                  } else {
                    if (mem4 != -1) {
                      mem2 = mem4;
                    }
                  }
                  mem = mem2;
                }
                if (mem == -1) mem = Math.floor(Math.random() * rcnt1);
              } else if (kadocnt != 0) {
                for (var i = 0; i < kadocnt; i++) {
                  if (this.mSetting.mType == ReversiConst.DEF_TYPE_HARD) {
                    tmpAnz = this.mReversi.getPointAnz(
                      color,
                      this.mEdge[i].y,
                      this.mEdge[i].x
                    );
                    if (tmpAnz != null) {
                      if (badPoint == -1) {
                        badPoint = tmpAnz.badPoint;
                        goodPoint = tmpAnz.goodPoint;
                        pointCnt = tmpAnz.pointCnt;
                        ownPointCnt = tmpAnz.ownPointCnt;
                        mem2 = i;
                        mem3 = i;
                        mem4 = i;
                      } else {
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
                        } else if (tmpAnz.pointCnt == pointCnt) {
                          if (ownPointCnt < tmpAnz.ownPointCnt) {
                            ownPointCnt = tmpAnz.ownPointCnt;
                            mem4 = i;
                          }
                        }
                      }
                    }
                  }
                  if (
                    this.mReversi.getMasuStsEna(
                      color,
                      this.mEdge[i].y,
                      this.mEdge[i].x
                    ) == 2
                  ) {
                    mem = i;
                  }
                }
                if (mem2 != -1) {
                  if (endZone != 0) {
                    // 終盤なら枚数重視
                    if (mem3 != -1) {
                      mem2 = mem3;
                    }
                  } else {
                    if (mem4 != -1) {
                      mem2 = mem4;
                    }
                  }
                  mem = mem2;
                }
                if (mem == -1) mem = Math.floor(Math.random() * kadocnt);
                // *** 置いても平気な角があればそこに置く*** //
                for (var i = 0; i < kadocnt; i++) {
                  if (
                    this.mReversi.checkEdge(
                      color,
                      this.mEdge[i].y,
                      this.mEdge[i].x
                    ) != 0
                  ) {
                    if (cpuflg0 == 0 && cpuflg1 == 0 && cpuflg2 == 0) {
                      cpuflg3 = 1;
                      rcnt2 = i;
                    }
                  }
                }
              }
              if (
                cpuflg1 == 0 &&
                cpuflg2 == 0 &&
                cpuflg0 == 0 &&
                cpuflg3 == 0
              ) {
                rcnt2 = mem;
              }
              if (rcnt1 != 0) {
                setY = this.mCpu[rcnt2].y;
                setX = this.mCpu[rcnt2].x;
              } else if (kadocnt != 0) {
                setY = this.mEdge[rcnt2].y;
                setX = this.mEdge[rcnt2].x;
              }
            }
          }

          if (this.mReversi.setMasuSts(color, setY, setX) == 0) {
            if (this.mSetting.mType == ReversiConst.DEF_TYPE_HARD)
              this.mReversi.AnalysisReversi(this.mPassEnaB, this.mPassEnaW);
            this.sendDrawMsg(setY, setX); // 描画
            update = 1;
          }
        }
      } else {
        break;
      }
    }
    if (update == 1) {
      this.drawUpdate(ReversiConst.DEF_ASSIST_OFF);
      if (this.mSetting.mAssist == ReversiConst.DEF_ASSIST_ON) {
        // *** メッセージ送信 *** //
        this.execMessage(LC_MSG_DRAW_INFO_ALL, null);
      }
    }

    return update;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief			マス描画更新
   *	@fn				public drawUpdate(assist : number) : void
   *	@param[in]		assist : number	アシスト設定
   *	@return			ありません
   *	@author			Yuta Yoshinaga
   *	@date			2017.06.01
   */
  ////////////////////////////////////////////////////////////////////////////////
  public drawUpdate(assist: number): void {
    if (assist == ReversiConst.DEF_ASSIST_ON) {
      for (var i = 0; i < this.mSetting.mMasuCnt; i++) {
        for (var j = 0; j < this.mSetting.mMasuCnt; j++) {
          this.sendDrawInfoMsg(i, j);
        }
      }
    }
    var waitTime = this.mSetting.mPlayDrawInterVal;
    var _this = this;
    for (var i = 0; i < this.mSetting.mMasuCnt; i++) {
      for (var j = 0; j < this.mSetting.mMasuCnt; j++) {
        if (
          this.mReversi.getMasuSts(i, j) != this.mReversi.getMasuStsOld(i, j)
        ) {
          setTimeout(
            function (i, j) {
              _this.sendDrawMsg(i, j);
            },
            waitTime,
            i,
            j
          );
          waitTime += this.mSetting.mPlayDrawInterVal;
        }
      }
    }
    // *** メッセージ送信 *** //
    this.execMessage(LC_MSG_CUR_COL, null);
    // *** メッセージ送信 *** //
    this.execMessage(LC_MSG_CUR_STS, null);
  }

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief			マス描画強制更新
   *	@fn				public drawUpdateForcibly(assist : number) : void
   *	@param[in]		assist : number	アシスト設定
   *	@return			ありません
   *	@author			Yuta Yoshinaga
   *	@date			2017.06.01
   */
  ////////////////////////////////////////////////////////////////////////////////
  public drawUpdateForcibly(assist: number): void {
    // *** メッセージ送信 *** //
    this.execMessage(LC_MSG_DRAW_ALL, null);
    if (assist == ReversiConst.DEF_ASSIST_ON) {
      // *** メッセージ送信 *** //
      this.execMessage(LC_MSG_DRAW_INFO_ALL, null);
    } else {
      // *** メッセージ送信 *** //
      this.execMessage(LC_MSG_ERASE_INFO_ALL, null);
    }
    // *** メッセージ送信 *** //
    this.execMessage(LC_MSG_CUR_COL, null);
    // *** メッセージ送信 *** //
    this.execMessage(LC_MSG_CUR_STS, null);
  }

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief			リセット処理
   *	@fn				public reset() : void
   *	@return			ありません
   *	@author			Yuta Yoshinaga
   *	@date			2017.06.01
   */
  ////////////////////////////////////////////////////////////////////////////////
  public reset(): void {
    this.mPassEnaB = 0;
    this.mPassEnaW = 0;
    if (this.mSetting.mGameSpd == ReversiConst.DEF_GAME_SPD_FAST) {
      this.mSetting.mPlayDrawInterVal = ReversiConst.DEF_GAME_SPD_FAST_VAL; // 描画のインターバル(msec)
      this.mSetting.mPlayCpuInterVal = ReversiConst.DEF_GAME_SPD_FAST_VAL2; // CPU対戦時のインターバル(msec)
    } else if (this.mSetting.mGameSpd == ReversiConst.DEF_GAME_SPD_MID) {
      this.mSetting.mPlayDrawInterVal = ReversiConst.DEF_GAME_SPD_MID_VAL; // 描画のインターバル(msec)
      this.mSetting.mPlayCpuInterVal = ReversiConst.DEF_GAME_SPD_MID_VAL2; // CPU対戦時のインターバル(msec)
    } else {
      this.mSetting.mPlayDrawInterVal = ReversiConst.DEF_GAME_SPD_SLOW_VAL; // 描画のインターバル(msec)
      this.mSetting.mPlayCpuInterVal = ReversiConst.DEF_GAME_SPD_SLOW_VAL2; // CPU対戦時のインターバル(msec)
    }

    this.mCurColor = this.mSetting.mPlayer;
    if (this.mSetting.mMode == ReversiConst.DEF_MODE_TWO)
      this.mCurColor = ReversiConst.REVERSI_STS_BLACK;

    this.mReversi.setMasuCnt(this.mSetting.mMasuCnt); // マスの数設定

    this.mReversi.reset();
    if (this.mSetting.mMode == ReversiConst.DEF_MODE_ONE) {
      if (this.mCurColor == ReversiConst.REVERSI_STS_WHITE) {
        var pCnt = this.mReversi.getPointCnt(ReversiConst.REVERSI_STS_BLACK);
        var pInfo: typeof ReversiPoint = this.mReversi.getPoint(
          ReversiConst.REVERSI_STS_BLACK,
          Math.floor(Math.random() * pCnt)
        );
        if (pInfo != null) {
          this.mReversi.setMasuSts(
            ReversiConst.REVERSI_STS_BLACK,
            pInfo.y,
            pInfo.x
          );
          if (this.mSetting.mType == ReversiConst.DEF_TYPE_HARD)
            this.mReversi.AnalysisReversi(this.mPassEnaB, this.mPassEnaW);
        }
      }
    }

    this.mPlayLock = 1;
    this.mGameEndSts = 0;

    this.drawUpdateForcibly(this.mSetting.mAssist);

    // *** 終了通知 *** //
    // *** メッセージ送信 *** //
    this.execMessage(LC_MSG_DRAW_END, null);
  }

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief			ゲーム終了アニメーション
   *	@fn				public gameEndAnimExec() : number
   *	@return			ウェイト時間
   *	@author			Yuta Yoshinaga
   *	@date			2017.06.01
   */
  ////////////////////////////////////////////////////////////////////////////////
  public gameEndAnimExec(): number {
    var bCnt,
      wCnt,
      offsetCnt = 2;
    var ret = 0;

    if (this.mSetting.mEndAnim == ReversiConst.DEF_END_ANIM_ON) {
      bCnt = this.mReversi.getBetCnt(ReversiConst.REVERSI_STS_BLACK);
      wCnt = this.mReversi.getBetCnt(ReversiConst.REVERSI_STS_WHITE);

      // *** 色、コマ数表示消去 *** //
      // *** メッセージ送信 *** //
      this.execMessage(LC_MSG_CUR_COL_ERASE, null);
      // *** メッセージ送信 *** //
      this.execMessage(LC_MSG_CUR_STS_ERASE, null);

      var _this = this;
      setTimeout(
        function (bCnt, wCnt) {
          // *** マス消去 *** //
          for (var i = 0; i < _this.mSetting.mMasuCnt; i++) {
            for (var j = 0; j < _this.mSetting.mMasuCnt; j++) {
              _this.mReversi.setMasuStsForcibly(
                ReversiConst.REVERSI_STS_NONE,
                i,
                j
              );
            }
          }
          // *** メッセージ送信 *** //
          _this.execMessage(LC_MSG_ERASE_ALL, null);

          // *** マス描画 *** //
          var bCnt2, wCnt2, bEnd, wEnd;
          bCnt2 = 0;
          wCnt2 = 0;
          bEnd = 0;
          wEnd = 0;
          var waitTime = _this.mSetting.mEndDrawInterVal;
          for (var i = 0; i < _this.mSetting.mMasuCnt; i++) {
            for (var j = 0; j < _this.mSetting.mMasuCnt; j++) {
              if (bCnt2 < bCnt) {
                bCnt2++;
                setTimeout(
                  function (i, j) {
                    _this.mReversi.setMasuStsForcibly(
                      ReversiConst.REVERSI_STS_BLACK,
                      i,
                      j
                    );
                    _this.sendDrawMsg(i, j);
                  },
                  waitTime,
                  i,
                  j
                );
              } else {
                bEnd = 1;
              }
              if (wCnt2 < wCnt) {
                wCnt2++;
                setTimeout(
                  function (i, j) {
                    _this.mReversi.setMasuStsForcibly(
                      ReversiConst.REVERSI_STS_WHITE,
                      _this.mSetting.mMasuCnt - 1 - i,
                      _this.mSetting.mMasuCnt - 1 - j
                    );
                    _this.sendDrawMsg(
                      _this.mSetting.mMasuCnt - 1 - i,
                      _this.mSetting.mMasuCnt - 1 - j
                    );
                  },
                  waitTime,
                  i,
                  j
                );
              } else {
                wEnd = 1;
              }
              if (bEnd == 1 && wEnd == 1) {
                break;
              } else {
                waitTime += _this.mSetting.mEndDrawInterVal;
              }
            }
          }
        },
        this.mSetting.mEndInterVal,
        bCnt,
        wCnt
      );
      //			ret = this.mSetting.mEndInterVal + this.mSetting.mEndDrawInterVal * (this.mSetting.mMasuCnt * this.mSetting.mMasuCnt);
      ret =
        this.mSetting.mEndInterVal +
        this.mSetting.mEndDrawInterVal * (Math.max(bCnt, wCnt) + offsetCnt);
    }
    return ret;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief			描画メッセージ送信
   *	@fn				public int sendDrawMsg(int y,int x)
   *	@param[in]		int y			Y座標
   *	@param[in]		int x			X座標
   *	@return			ありません
   *	@author			Yuta Yoshinaga
   *	@date			2014.06.26
   */
  ////////////////////////////////////////////////////////////////////////////////
  public sendDrawMsg(y: number, x: number): void {
    var mTmpPoint: any = new ReversiPoint();
    mTmpPoint.y = y;
    mTmpPoint.x = x;
    // *** メッセージ送信 *** //
    this.execMessage(LC_MSG_DRAW, mTmpPoint);
  }

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief			情報描画メッセージ送信
   *	@fn				public int sendDrawInfoMsg(int y,int x)
   *	@param[in]		int y			Y座標
   *	@param[in]		int x			X座標
   *	@return			ありません
   *	@author			Yuta Yoshinaga
   *	@date			2014.06.26
   */
  ////////////////////////////////////////////////////////////////////////////////
  public sendDrawInfoMsg(y: number, x: number): void {
    var mTmpPoint: any = new ReversiPoint();
    mTmpPoint.y = y;
    mTmpPoint.x = x;
    // *** メッセージ送信 *** //
    this.execMessage(LC_MSG_DRAW_INFO, mTmpPoint);
  }

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief			メッセージコールバック設定
   *	@fn				public setViewMsgDlgFunc(func : any) : void
   *	@param[in]		func : any メッセージコールバック設定
   *	@return			ありません
   *	@author			Yuta Yoshinaga
   *	@date			2017.06.01
   */
  ////////////////////////////////////////////////////////////////////////////////
  public setViewMsgDlgFunc(func: any): void {
    this.viewMsgDlgFunc = func;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief			メッセージ表示
   *	@fn				private viewMsgDlg(title: string, msg: string): void
   *	@param[in]		title: string	タイトル
   *	@param[in]		msg: string		メッセージ
   *	@return			ありません
   *	@author			Yuta Yoshinaga
   *	@date			2017.06.01
   */
  ////////////////////////////////////////////////////////////////////////////////
  private viewMsgDlg(title: string, msg: string): void {
    if (this.viewMsgDlgFunc != null) {
      this.viewMsgDlgFunc(title, msg);
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief			描画コールバック設定
   *	@fn				public setViewMsgDlgFunc(func : any) : void
   *	@param[in]		func : any 描画コールバック設定
   *	@return			ありません
   *	@author			Yuta Yoshinaga
   *	@date			2017.06.01
   */
  ////////////////////////////////////////////////////////////////////////////////
  public setDrawSingleFunc(func: any): void {
    this.drawSingleFunc = func;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief			描画コールバック
   *	@fn				private drawSingle(y : number, x : number, sts : number, bk : number, text : string): void
   *	@param[in]		y : number		Y座標
   *	@param[in]		x : number		X座標
   *	@param[in]		sts : number	ステータス
   *	@param[in]		bk : number		背景種類
   *	@param[in]		text : string	表示テキスト
   *	@return			ありません
   *	@author			Yuta Yoshinaga
   *	@date			2017.06.01
   */
  ////////////////////////////////////////////////////////////////////////////////
  private drawSingle(
    y: number,
    x: number,
    sts: number,
    bk: number,
    text: string
  ): void {
    if (this.drawSingleFunc != null) {
      if (text == "0") text = "";
      this.drawSingleFunc(y, x, sts, bk, text);
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief			現在の色コールバック設定
   *	@fn				public setCurColMsgFunc(func : any) : void
   *	@param[in]		func : any 現在の色コールバック設定
   *	@return			ありません
   *	@author			Yuta Yoshinaga
   *	@date			2017.06.01
   */
  ////////////////////////////////////////////////////////////////////////////////
  public setCurColMsgFunc(func: any): void {
    this.curColMsgFunc = func;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief			現在の色コールバック
   *	@fn				public curColMsg(text : string): void
   *	@param[in]		text : string	表示テキスト
   *	@return			ありません
   *	@author			Yuta Yoshinaga
   *	@date			2017.06.01
   */
  ////////////////////////////////////////////////////////////////////////////////
  private curColMsg(text: string): void {
    if (this.curColMsgFunc != null) {
      this.curColMsgFunc(text);
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief			現在のステータスコールバック設定
   *	@fn				public setCurStsMsgFunc(func : any) : void
   *	@param[in]		func : any 現在のステータスコールバック設定
   *	@return			ありません
   *	@author			Yuta Yoshinaga
   *	@date			2017.06.01
   */
  ////////////////////////////////////////////////////////////////////////////////
  public setCurStsMsgFunc(func: any): void {
    this.curStsMsgFunc = func;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief			現在のステータスコールバック
   *	@fn				private curStsMsg(text : string): void
   *	@param[in]		text : string	表示テキスト
   *	@return			ありません
   *	@author			Yuta Yoshinaga
   *	@date			2017.06.01
   */
  ////////////////////////////////////////////////////////////////////////////////
  private curStsMsg(text: string): void {
    if (this.curStsMsgFunc != null) {
      this.curStsMsgFunc(text);
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief			メッセージ
   *	@fn				private execMessage(message : number) :void
   *	@param[in]		title: string	タイトル
   *	@param[in]		msg: string		メッセージ
   *	@return			ありません
   *	@author			Yuta Yoshinaga
   *	@date			2017.06.01
   */
  ////////////////////////////////////////////////////////////////////////////////
  private execMessage(what: number, obj: any): void {
    var dMode,
      dBack,
      dCnt,
      exec = 0;
    if (what == LC_MSG_DRAW) {
      // *** マス描画 *** //
      var msgPoint: typeof ReversiPoint = obj;
      dMode = this.mReversi.getMasuSts(msgPoint.y, msgPoint.x);
      dBack = this.mReversi.getMasuStsEna(
        this.mCurColor,
        msgPoint.y,
        msgPoint.x
      );
      dCnt = this.mReversi.getMasuStsCnt(
        this.mCurColor,
        msgPoint.y,
        msgPoint.x
      );
      this.drawSingle(msgPoint.y, msgPoint.x, dMode, dBack, String(dCnt));
    } else if (what == LC_MSG_ERASE) {
      // *** マス消去 *** //
      var msgPoint: typeof ReversiPoint = obj;
      this.drawSingle(msgPoint.y, msgPoint.x, 0, 0, String(0));
    } else if (what == LC_MSG_DRAW_INFO) {
      // *** マス情報描画 *** //
      var msgPoint: typeof ReversiPoint = obj;
      dMode = this.mReversi.getMasuSts(msgPoint.y, msgPoint.x);
      dBack = this.mReversi.getMasuStsEna(
        this.mCurColor,
        msgPoint.y,
        msgPoint.x
      );
      dCnt = this.mReversi.getMasuStsCnt(
        this.mCurColor,
        msgPoint.y,
        msgPoint.x
      );
      this.drawSingle(msgPoint.y, msgPoint.x, dMode, dBack, String(dCnt));
    } else if (what == LC_MSG_ERASE_INFO) {
      // *** マス情報消去 *** //
      var msgPoint: typeof ReversiPoint = obj;
      dMode = this.mReversi.getMasuSts(msgPoint.y, msgPoint.x);
      this.drawSingle(msgPoint.y, msgPoint.x, dMode, 0, String(0));
    } else if (what == LC_MSG_DRAW_ALL) {
      // *** 全マス描画 *** //
      for (var i = 0; i < this.mSetting.mMasuCnt; i++) {
        for (var j = 0; j < this.mSetting.mMasuCnt; j++) {
          dMode = this.mReversi.getMasuSts(i, j);
          dBack = this.mReversi.getMasuStsEna(this.mCurColor, i, j);
          dCnt = this.mReversi.getMasuStsCnt(this.mCurColor, i, j);
          this.drawSingle(i, j, dMode, dBack, String(dCnt));
        }
      }
    } else if (what == LC_MSG_ERASE_ALL) {
      // *** 全マス消去 *** //
      for (var i = 0; i < this.mSetting.mMasuCnt; i++) {
        for (var j = 0; j < this.mSetting.mMasuCnt; j++) {
          this.drawSingle(i, j, 0, 0, String(0));
        }
      }
    } else if (what == LC_MSG_DRAW_INFO_ALL) {
      // *** 全マス情報描画 *** //
      for (var i = 0; i < this.mSetting.mMasuCnt; i++) {
        for (var j = 0; j < this.mSetting.mMasuCnt; j++) {
          dMode = this.mReversi.getMasuSts(i, j);
          dBack = this.mReversi.getMasuStsEna(this.mCurColor, i, j);
          dCnt = this.mReversi.getMasuStsCnt(this.mCurColor, i, j);
          this.drawSingle(i, j, dMode, dBack, String(dCnt));
        }
      }
    } else if (what == LC_MSG_ERASE_INFO_ALL) {
      // *** 全マス情報消去 *** //
      for (var i = 0; i < this.mSetting.mMasuCnt; i++) {
        for (var j = 0; j < this.mSetting.mMasuCnt; j++) {
          dMode = this.mReversi.getMasuSts(i, j);
          this.drawSingle(i, j, dMode, 0, String(0));
        }
      }
    } else if (what == LC_MSG_DRAW_END) {
      this.mPlayLock = 0;
    } else if (what == LC_MSG_CUR_COL) {
      var tmpStr: string = "";
      if (this.mSetting.mMode == ReversiConst.DEF_MODE_ONE) {
        if (this.mCurColor == ReversiConst.REVERSI_STS_BLACK)
          tmpStr = "あなたはプレイヤー1です ";
        else tmpStr = "あなたはプレイヤー2です ";
      } else {
        if (this.mCurColor == ReversiConst.REVERSI_STS_BLACK)
          tmpStr = "プレイヤー1の番です ";
        else tmpStr = "プレイヤー2の番です ";
      }
      this.curColMsg(tmpStr);
    } else if (what == LC_MSG_CUR_COL_ERASE) {
      this.curColMsg("");
    } else if (what == LC_MSG_CUR_STS) {
      var tmpStr: string =
        "プレイヤー1 = " +
        this.mReversi.getBetCnt(ReversiConst.REVERSI_STS_BLACK) +
        " プレイヤー2 = " +
        this.mReversi.getBetCnt(ReversiConst.REVERSI_STS_WHITE);
      this.curStsMsg(tmpStr);
    } else if (what == LC_MSG_CUR_STS_ERASE) {
      this.curStsMsg("");
    } else if (what == LC_MSG_MSG_DLG) {
    } else if (what == LC_MSG_DRAW_ALL_RESET) {
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief			セッター
   *	@fn				public setSetting(mSetting: ReversiSetting): void
   *	@param[in]		mSetting: ReversiSetting
   *	@return			ありません
   *	@author			Yuta Yoshinaga
   *	@date			2017.06.01
   */
  ////////////////////////////////////////////////////////////////////////////////
  public setSetting(mSetting: typeof ReversiSetting): void {
    this.mSetting = mSetting;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief			ゲッター
   *	@fn				public getetSetting(): ReversiSetting
   *	@return			リバーシ設定クラス
   *	@author			Yuta Yoshinaga
   *	@date			2017.06.01
   */
  ////////////////////////////////////////////////////////////////////////////////
  public getetSetting(): typeof ReversiSetting {
    return this.mSetting;
  }
};
