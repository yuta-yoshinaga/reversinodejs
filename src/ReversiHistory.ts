////////////////////////////////////////////////////////////////////////////////
/**	@file       ReversiHistory.ts
 *	@brief			リバーシ履歴クラス実装ファイル
 *	@author			Yuta Yoshinaga
 *	@date       2020.07.25
 *	$Version:		$
 *	$Revision:  $
 *
 * (c) 2020 Yuta Yoshinaga.
 *
 * - 本ソフトウェアの一部又は全てを無断で複写複製（コピー）することは、
 *   著作権侵害にあたりますので、これを禁止します。
 * - 本製品の使用に起因する侵害または特許権その他権利の侵害に関しては
 *   当方は一切その責任を負いません。
 */
////////////////////////////////////////////////////////////////////////////////

namespace ReversiHistoryWrap {
  const ReversiPoint = require("./ReversiPoint");

  ////////////////////////////////////////////////////////////////////////////////
  /**	@class		ReversiHistory
   *	@brief		リバーシ履歴クラス
   */
  ////////////////////////////////////////////////////////////////////////////////
  module.exports = class ReversiHistory {
    public point: typeof ReversiPoint;
    public color: number;

    ////////////////////////////////////////////////////////////////////////////////
    /**	@brief		コンストラクタ
     *	@fn				public constructor()
     *	@return		ありません
     *	@author		Yuta Yoshinaga
     *	@date			2020.07.25
     */
    ////////////////////////////////////////////////////////////////////////////////
    public constructor() {
      this.point = new ReversiPoint();
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
      this.point.x = -1;
      this.point.y = -1;
      this.color = -1;
    }
  }
}
