////////////////////////////////////////////////////////////////////////////////
/**	@file       ReversiPlayDelegate.ts
 *	@brief			リバーシデリゲートファイル
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

import { ReversiPlayInterface } from "./ReversiPlayInterface";

namespace ReversiPlayDelegateWrap {
  const FuncsJson = require("./FuncsJson");

  ////////////////////////////////////////////////////////////////////////////////
  /**	@class		ReversiPlayDelegate
   *	@brief		リバーシデリゲートファイル
   */
  ////////////////////////////////////////////////////////////////////////////////
  module.exports = class ReversiPlayDelegate {
    private impl: ReversiPlayInterface;

    ////////////////////////////////////////////////////////////////////////////////
    /**	@brief      コンストラクタ
     *	@fn				  public constructor(impl: ReversiPlayInterface)
     *	@param[in]  impl: ReversiPlayInterface
     *	@return     ありません
     *	@author     Yuta Yoshinaga
     *	@date			  2020.07.25
     */
    ////////////////////////////////////////////////////////////////////////////////
    public constructor(impl: ReversiPlayInterface) {
      this.impl = impl;
    }

    ////////////////////////////////////////////////////////////////////////////////
    /**	@brief			メッセージ表示
     *	@fn				  viewMsgDlg(title: string, msg: string): void
     *	@param[in]  title: string	タイトル
     *	@param[in]  msg: string		メッセージ
     *	@return			ありません
     *	@author			Yuta Yoshinaga
     *	@date			  2020.07.25
     */
    ////////////////////////////////////////////////////////////////////////////////
    public viewMsgDlg(title: string, msg: string): typeof FuncsJson {
      return this.impl.viewMsgDlg(title, msg);
    }

    ////////////////////////////////////////////////////////////////////////////////
    /**	@brief			描画コールバック
     *	@fn				  drawSingle(y : number, x : number, sts : number, bk : number, text : string): void
     *	@param[in]	y : number		Y座標
     *	@param[in]	x : number		X座標
     *	@param[in]	sts : number	ステータス
     *	@param[in]	bk : number		背景種類
     *	@param[in]	text : string	表示テキスト
     *	@return			ありません
     *	@author			Yuta Yoshinaga
     *	@date			  2020.07.25
     */
    ////////////////////////////////////////////////////////////////////////////////
    public drawSingle(
      y: number,
      x: number,
      sts: number,
      bk: number,
      text: string
    ): typeof FuncsJson {
      return this.impl.drawSingle(y, x, sts, bk, text);
    }

    ////////////////////////////////////////////////////////////////////////////////
    /**	@brief			現在の色コールバック
     *	@fn				  curColMsg(text : string): void
     *	@param[in]  text : string	表示テキスト
     *	@return			ありません
     *	@author			Yuta Yoshinaga
     *	@date       2020.07.25
     */
    ////////////////////////////////////////////////////////////////////////////////
    public curColMsg(text: string): typeof FuncsJson {
      return this.impl.curColMsg(text);
    }

    ////////////////////////////////////////////////////////////////////////////////
    /**	@brief			現在のステータスコールバック
     *	@fn				  curStsMsg(text : string): void
     *	@param[in]  text : string	表示テキスト
     *	@return			ありません
     *	@author			Yuta Yoshinaga
     *	@date	      2020.07.25
     */
    ////////////////////////////////////////////////////////////////////////////////
    public curStsMsg(text: string): typeof FuncsJson {
      return this.impl.curStsMsg(text);
    }

    ////////////////////////////////////////////////////////////////////////////////
    /**	@brief			現在のステータスコールバック
     *	@fn				  wait(time : number): void
     *	@param[in]  time : number	ウェイト時間(msec)
     *	@return			ありません
     *	@author			Yuta Yoshinaga
     *	@date	      2020.07.25
     */
    ////////////////////////////////////////////////////////////////////////////////
    public wait(time: number): typeof FuncsJson {
      return this.impl.wait(time);
    }
  }
}
