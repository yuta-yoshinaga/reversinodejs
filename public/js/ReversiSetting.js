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
var REVERSI_STS_NONE = 0; //!< コマ無し
var REVERSI_STS_BLACK = 1; //!< 黒
var REVERSI_STS_WHITE = 2; //!< 白
var REVERSI_STS_MIN = 0; //!< ステータス最小値
var REVERSI_STS_MAX = 2; //!< ステータス最大値
var REVERSI_MASU_CNT = 8; //!< 縦横マス数
var DEF_MODE_ONE = 0; //!< 一人対戦
var DEF_MODE_TWO = 1; //!< 二人対戦
var DEF_TYPE_EASY = 0; //!< CPU 弱い
var DEF_TYPE_NOR = 1; //!< CPU 普通
var DEF_TYPE_HARD = 2; //!< CPU 強い
var DEF_COLOR_BLACK = 0; //!< コマ色 黒
var DEF_COLOR_WHITE = 1; //!< コマ色 白
var DEF_ASSIST_OFF = 0; //!< アシスト OFF
var DEF_ASSIST_ON = 1; //!< アシスト ON
var DEF_GAME_SPD_FAST = 0; //!< ゲームスピード 早い
var DEF_GAME_SPD_MID = 1; //!< ゲームスピード 普通
var DEF_GAME_SPD_SLOW = 2; //!< ゲームスピード 遅い
var DEF_GAME_SPD_FAST_VAL = 0; //!< ゲームスピード 早い
var DEF_GAME_SPD_MID_VAL = 50; //!< ゲームスピード 普通
var DEF_GAME_SPD_SLOW_VAL = 100; //!< ゲームスピード 遅い
var DEF_GAME_SPD_FAST_VAL2 = 0; //!< ゲームスピード 早い
var DEF_GAME_SPD_MID_VAL2 = 500; //!< ゲームスピード 普通
var DEF_GAME_SPD_SLOW_VAL2 = 1000; //!< ゲームスピード 遅い
var DEF_END_ANIM_OFF = 0; //!< 終了アニメーション OFF
var DEF_END_ANIM_ON = 1; //!< 終了アニメーション ON
var DEF_MASU_CNT_6 = 0; //!< マス縦横6
var DEF_MASU_CNT_8 = 1; //!< マス縦横8
var DEF_MASU_CNT_10 = 2; //!< マス縦横10
var DEF_MASU_CNT_12 = 3; //!< マス縦横12
var DEF_MASU_CNT_14 = 4; //!< マス縦横14
var DEF_MASU_CNT_16 = 5; //!< マス縦横16
var DEF_MASU_CNT_6_VAL = 6; //!< マス縦横6
var DEF_MASU_CNT_8_VAL = 8; //!< マス縦横8
var DEF_MASU_CNT_10_VAL = 10; //!< マス縦横10
var DEF_MASU_CNT_12_VAL = 12; //!< マス縦横12
var DEF_MASU_CNT_14_VAL = 14; //!< マス縦横14
var DEF_MASU_CNT_16_VAL = 16; //!< マス縦横16
var DEF_MASU_CNT_MAX_VAL = DEF_MASU_CNT_16_VAL; //!< マス縦横最大
////////////////////////////////////////////////////////////////////////////////
/**	@class		ReversiSetting
 *	@brief		リバーシ設定クラス
 */
////////////////////////////////////////////////////////////////////////////////
var ReversiSetting = (function() {
    ////////////////////////////////////////////////////////////////////////////////
    /**	@brief			コンストラクタ
     *	@fn				public constructor()
     *	@return			ありません
     *	@author			Yuta Yoshinaga
     *	@date			2017.06.01
     */
    ////////////////////////////////////////////////////////////////////////////////
    function ReversiSetting() {
        this.Mode = DEF_MODE_ONE; //!< 現在のモード
        this.Type = DEF_TYPE_HARD; //!< 現在のタイプ
        this.Player = REVERSI_STS_BLACK; //!< プレイヤーの色
        this.Assist = DEF_ASSIST_ON; //!< アシスト
        this.GameSpd = DEF_GAME_SPD_MID; //!< ゲームスピード
        this.EndAnim = DEF_END_ANIM_ON; //!< ゲーム終了アニメーション
        this.MasuCntMenu = DEF_MASU_CNT_8; //!< マスの数
        this.MasuCnt = DEF_MASU_CNT_8_VAL; //!< マスの数
        this.PlayCpuInterVal = DEF_GAME_SPD_MID_VAL2; //!< CPU対戦時のインターバル(msec)
        this.PlayDrawInterVal = DEF_GAME_SPD_MID_VAL; //!< 描画のインターバル(msec)
        this.EndDrawInterVal = 100; //!< 終了アニメーション描画のインターバル(msec)
        this.EndInterVal = 500; //!< 終了アニメーションのインターバル(msec)
        this.Theme = 'Cerulean'; //!< テーマ名
        this.PlayerColor1 = '#000000'; //!< プレイヤー1の色
        this.PlayerColor2 = '#ffffff'; //!< プレイヤー2の色
        this.BackGroundColor = '#00ff00'; //!< 背景の色
        this.BorderColor = '#000000'; //!< 枠線の色
    }
    return ReversiSetting;
}());
//# sourceMappingURL=ReversiSetting.js.map