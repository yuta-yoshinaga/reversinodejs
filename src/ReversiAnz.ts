////////////////////////////////////////////////////////////////////////////////
/**	@file       ReversiAnz.ts
 *	@brief			リバーシ解析クラス実装ファイル
 *	@author			Yuta Yoshinaga
 *	@date       2020.07.25
 *	$Version:		$
 *	$Revision:  $
 *
 * (c) 2017 Yuta Yoshinaga.
 *
 * - 本ソフトウェアの一部又は全てを無断で複写複製（コピー）することは、
 *   著作権侵害にあたりますので、これを禁止します。
 * - 本製品の使用に起因する侵害または特許権その他権利の侵害に関しては
 *   当方は一切その責任を負いません。
 */
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
/**	@class		ReversiAnz
 *	@brief		リバーシ解析クラス
 */
////////////////////////////////////////////////////////////////////////////////
module.exports = class ReversiAnz {
  public min: number; //!< 最小値
  public max: number; //!< 最大値
  public avg: number; //!< 平均
  public pointCnt: number; //!< 置けるポイント数
  public edgeCnt: number; //!< 角を取れるポイント数
  public edgeSideOneCnt: number; //!< 角一つ前を取れるポイント数
  public edgeSideTwoCnt: number; //!< 角二つ前を取れるポイント数
  public edgeSideThreeCnt: number; //!< 角三つ前を取れるポイント数
  public edgeSideOtherCnt: number; //!< それ以外を取れるポイント数
  public ownMin: number; //!< 最小値
  public ownMax: number; //!< 最大値
  public ownAvg: number; //!< 平均
  public ownPointCnt: number; //!< 置けるポイント数
  public ownEdgeCnt: number; //!< 角を取れるポイント数
  public ownEdgeSideOneCnt: number; //!< 角一つ前を取れるポイント数
  public ownEdgeSideTwoCnt: number; //!< 角二つ前を取れるポイント数
  public ownEdgeSideThreeCnt: number; //!< 角三つ前を取れるポイント数
  public ownEdgeSideOtherCnt: number; //!< それ以外を取れるポイント数
  public badPoint: number; //!< 悪手ポイント
  public goodPoint: number; //!< 良手ポイント

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief		コンストラクタ
   *	@fn				public constructor()
   *	@return		ありません
   *	@author		Yuta Yoshinaga
   *	@date			2020.07.25
   */
  ////////////////////////////////////////////////////////////////////////////////
  public constructor() {
    this.reset();
  }

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief		リセット
   *	@fn				public reset() : void
   *	@return		ありません
   *	@author		Yuta Yoshinaga
   *	@date			2020.07.25
   */
  ////////////////////////////////////////////////////////////////////////////////
  public reset(): void {
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

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief			セッター
   *	@fn         public setSession(session: any): void
   *	@param[in]  session: any
   *	@return			ありません
   *	@author			Yuta Yoshinaga
   *	@date       2020.07.25
   */
  ////////////////////////////////////////////////////////////////////////////////
  public setSession(session: any): void {
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
  }
};
