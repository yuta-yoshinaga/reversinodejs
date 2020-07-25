////////////////////////////////////////////////////////////////////////////////
/**	@file       ResJson.ts
 *	@brief			レスポンスJSONクラス実装ファイル
 *	@author			Yuta Yoshinaga
 *	@date       2020.07.25
 *	$Version:   $
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

namespace ResJsonWrap {
  const CallbacksJson = require("./CallbacksJson");

  ////////////////////////////////////////////////////////////////////////////////
  /**	@class		ResJson
   *	@brief		レスポンスJSONクラス実装ファイル
   */
  ////////////////////////////////////////////////////////////////////////////////
  module.exports = class ResJson {
    public Auth: string;
    public Callbacks: typeof CallbacksJson;

    ////////////////////////////////////////////////////////////////////////////////
    /**	@brief    コンストラクタ
     *	@fn				public constructor()
     *	@return   ありません
     *	@author   Yuta Yoshinaga
     *	@date			2020.07.25
     */
    ////////////////////////////////////////////////////////////////////////////////
    public constructor() {
      this.Auth = "";
      this.Callbacks = null;
    }
  }
}
