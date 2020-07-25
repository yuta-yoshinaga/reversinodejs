////////////////////////////////////////////////////////////////////////////////
/**	@file       FuncsJson.ts
 *	@brief			ファンクションJSONクラス実装ファイル
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

////////////////////////////////////////////////////////////////////////////////
/**	@class		FuncsJson
 *	@brief		ファンクションJSONクラス
 */
////////////////////////////////////////////////////////////////////////////////
module.exports = class FuncsJson {
  public Function: string;
  public Param1: string;
  public Param2: string;
  public Param3: string;
  public Param4: string;
  public Param5: string;

  ////////////////////////////////////////////////////////////////////////////////
  /**	@brief    コンストラクタ
   *	@fn				public constructor()
   *	@return   ありません
   *	@author   Yuta Yoshinaga
   *	@date			2020.07.25
   */
  ////////////////////////////////////////////////////////////////////////////////
  public constructor() {
    this.Function = '';
    this.Param1 = '';
    this.Param2 = '';
    this.Param3 = '';
    this.Param4 = '';
    this.Param5 = '';
  }
};
