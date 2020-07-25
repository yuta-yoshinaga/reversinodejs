////////////////////////////////////////////////////////////////////////////////
/**	@file       ReversiPlayInterfaceImpl.ts
 *	@brief			リバーシプレイインタフェース実装ファイル
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

namespace ReversiPlayInterfaceImplWrap {
  const FuncsJson = require("./FuncsJson");

  ////////////////////////////////////////////////////////////////////////////////
  /**	@class		ReversiPlayInterfaceImpl
   *	@brief		リバーシプレイインタフェース実装ファイル
   */
  ////////////////////////////////////////////////////////////////////////////////
  module.exports = class ReversiPlayInterfaceImpl
    implements ReversiPlayInterface {
    ////////////////////////////////////////////////////////////////////////////////
    /**	@brief      コンストラクタ
     *	@fn				  public constructor()
     *	@return     ありません
     *	@author     Yuta Yoshinaga
     *	@date			  2020.07.25
     */
    ////////////////////////////////////////////////////////////////////////////////
    public constructor() {}

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
      let funcs = new FuncsJson();
      funcs.Function = "ViewMsgDlg";
      funcs.Param1 = title;
      funcs.Param2 = msg;
      return funcs;
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
      let funcs = new FuncsJson();
      funcs.Function = "DrawSingle";
      funcs.Param1 = String(y);
      funcs.Param2 = String(x);
      funcs.Param3 = String(sts);
      funcs.Param4 = String(bk);
      funcs.Param5 = text;
      return funcs;
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
      let funcs = new FuncsJson();
      funcs.Function = "CurColMsg";
      funcs.Param1 = text;
      return funcs;
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
      let funcs = new FuncsJson();
      funcs.Function = "CurStsMsg";
      funcs.Param1 = text;
      return funcs;
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
      let funcs = new FuncsJson();
      funcs.Function = "Wait";
      funcs.Param1 = String(time);
      return funcs;
    }
  };
}
