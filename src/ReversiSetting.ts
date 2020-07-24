////////////////////////////////////////////////////////////////////////////////
/**	@file			ReversiSetting.ts
 *	@brief			リバーシ設定クラス実装ファイル
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

let ReversiConst3 = require("./ReversiConst");

////////////////////////////////////////////////////////////////////////////////
/**	@class		ReversiSetting
 *	@brief		リバーシ設定クラス
 */
////////////////////////////////////////////////////////////////////////////////
module.exports = class ReversiSetting {
  public mMode: number = ReversiConst3.DEF_MODE_ONE; //!< 現在のモード
  public mType: number = ReversiConst3.DEF_TYPE_HARD; //!< 現在のタイプ
  public mPlayer: number = ReversiConst3.REVERSI_STS_BLACK; //!< プレイヤーの色
  public mAssist: number = ReversiConst3.DEF_ASSIST_ON; //!< アシスト
  public mGameSpd: number = ReversiConst3.DEF_GAME_SPD_MID; //!< ゲームスピード
  public mEndAnim: number = ReversiConst3.DEF_END_ANIM_ON; //!< ゲーム終了アニメーション
  public mMasuCntMenu: number = ReversiConst3.DEF_MASU_CNT_8; //!< マスの数
  public mMasuCnt: number = ReversiConst3.DEF_MASU_CNT_8_VAL; //!< マスの数

  public mPlayCpuInterVal: number = ReversiConst3.DEF_GAME_SPD_MID_VAL2; //!< CPU対戦時のインターバル(msec)
  public mPlayDrawInterVal: number = ReversiConst3.DEF_GAME_SPD_MID_VAL; //!< 描画のインターバル(msec)
  public mEndDrawInterVal: number = 100; //!< 終了アニメーション描画のインターバル(msec)
  public mEndInterVal: number = 500; //!< 終了アニメーションのインターバル(msec)
  public mTheme: string = "Cerulean"; //!< テーマ名
  public mPlayerColor1: string = "#000000"; //!< プレイヤー1の色
  public mPlayerColor2: string = "#FFFFFF"; //!< プレイヤー2の色
  public mBackGroundColor: string = "#00FF00"; //!< 背景の色
  public mBorderColor: string = "#000000"; //!< 枠線の色

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief			コンストラクタ
   *	@fn				public constructor()
   *	@return			ありません
   *	@author			Yuta Yoshinaga
   *	@date			2017.06.01
   */
  ////////////////////////////////////////////////////////////////////////////////
  public constructor() {}
};
