var reversiSetting = new ReversiSetting();
var reversiSettingBk = reversiSetting;
var storage = localStorage;

$(document).ready(function() {
    function callbacks(obj) {
        var wait_time = 0;
        Object.keys(obj).forEach(function(key) {
            console.log(obj[key]);
            if (obj[key].Function == "Wait") {
                wait_time += Number(obj[key].Param1);
            }
            setTimeout(function(param) {
                if (param.Function == "ViewMsgDlg") {
                    viewMsgDlg(param.Param1, param.Param2);
                } else if (param.Function == "DrawSingle") {
                    drawSingle(param.Param1, param.Param2, param.Param3, param.Param4, param.Param5);
                } else if (param.Function == "CurColMsg") {
                    curColMsg(param.Param1);
                } else if (param.Function == "CurStsMsg") {
                    curStsMsg(param.Param1);
                }
            }, wait_time, obj[key]);
        });
    }

    function setSetting(reversiSetting) {
        var requestObj = $.stringify(reversiSetting);
        $.ajax({
            url: "./FrontController",
            type: 'POST',
            data: {
                func: "setSetting",
                para: requestObj,
            },
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
            },
            xhrFields: { withCredentials: true },
        }).done(function(response, textStatus, jqXHR) {
            // 成功時処理
            // レスポンスデータはパースされた上でresponseに渡される
            console.log('done');
            console.log(response);
            callbacks(response.Callbacks.Funcs);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            // 失敗時処理
            console.log('fall');
        }).always(function(data_or_jqXHR, textStatus, jqXHR_or_errorThrown) {
            // doneまたはfail実行後の共通処理
        });
    }

    function reset() {
        $.ajax({
            url: "./FrontController",
            type: 'POST',
            data: {
                func: "reset",
            },
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
            },
            xhrFields: { withCredentials: true },
        }).done(function(response, textStatus, jqXHR) {
            // 成功時処理
            // レスポンスデータはパースされた上でresponseに渡される
            console.log('done');
            console.log(response);
            callbacks(response.Callbacks.Funcs);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            // 失敗時処理
            console.log('fall');
        }).always(function(data_or_jqXHR, textStatus, jqXHR_or_errorThrown) {
            // doneまたはfail実行後の共通処理
        });
    }

    function reversiPlay(y, x) {
        $.ajax({
            url: "./FrontController",
            type: 'POST',
            data: {
                func: "reversiPlay",
                y: y,
                x: x,
            },
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
            },
            xhrFields: { withCredentials: true },
        }).done(function(response, textStatus, jqXHR) {
            // 成功時処理
            // レスポンスデータはパースされた上でresponseに渡される
            console.log('done');
            console.log(response);
            callbacks(response.Callbacks.Funcs);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            // 失敗時処理
            console.log('fall');
        }).always(function(data_or_jqXHR, textStatus, jqXHR_or_errorThrown) {
            // doneまたはfail実行後の共通処理
        });
    }

    jQuery('.minicolor').each(function() {
        //
        // Dear reader, it's actually very easy to initialize MiniColors. For example:
        //
        //  jQuery(selector).minicolors();
        //
        // The way I've done it below is just for the demo, so don't get confused
        // by it. Also, data- attributes aren't supported at this time...they're
        // only used for this demo.
        //
        jQuery(this).minicolors({
            control: jQuery(this).attr('data-control') || 'hue',
            defaultValue: jQuery(this).attr('data-defaultValue') || '',
            inline: jQuery(this).attr('data-inline') === 'true',
            letterCase: jQuery(this).attr('data-letterCase') || 'lowercase',
            opacity: jQuery(this).attr('data-opacity'),
            position: jQuery(this).attr('data-position') || 'bottom left',
            change: function(hex, opacity) {
                if (!hex) return;
                if (typeof console === 'object') {
                    //console.log(hex + ' ' + this.id);
                }
            },
            theme: 'bootstrap'
        });
    });
    // storage.clear();
    var lReversiSetting = storage.getItem('appSetting-go');
    if (lReversiSetting != null) reversiSetting = JSON.parse(lReversiSetting);
    else storage.setItem('appSetting-go', JSON.stringify(reversiSetting));
    if (reversiSetting.PlayerColor1 === undefined) reversiSetting.PlayerColor1 = '#000000';
    if (reversiSetting.PlayerColor2 === undefined) reversiSetting.PlayerColor2 = '#ffffff';
    if (reversiSetting.BackGroundColor === undefined) reversiSetting.BackGroundColor = '#00ff00';
    if (reversiSetting.BorderColor === undefined) reversiSetting.BorderColor = '#000000';
    // *** 設定値をメニューに反映 *** //
    set_menu_ui();
    // *** マスを用意 *** //
    appInit();
    setSetting(reversiSetting);
    //reset();
    // *** クリックイベント *** //
    $('.reversi_field').on('click', '.square-wrapper', function() {
        var curX = $(this).data('x');
        var curY = $(this).data('y');
        console.log('x = ' + curX + ',y = ' + curY);
        reversiPlay(curY, curX);
    });
    $('.reversi_field').on('click', '.reset', function() {
        reset();
    });
    $('.reversi_field').on('click', '.setting', function() {
        reversiSettingBk = reversiSetting;
    });
    $('#appMenuModal').on('click', '.btn-primary', function() {
        reversiSetting.Mode = Number($("#mMode .active input").val());
        reversiSetting.Type = Number($("#mType .active input").val());
        reversiSetting.Player = Number($("#mPlayer .active input").val());
        reversiSetting.Assist = Number($("#mAssist .active input").val());
        reversiSetting.GameSpd = Number($("#mGameSpd .active input").val());
        if (reversiSetting.GameSpd == DEF_GAME_SPD_FAST) {
            reversiSetting.PlayCpuInterVal = DEF_GAME_SPD_FAST_VAL2;
            reversiSetting.PlayDrawInterVal = DEF_GAME_SPD_FAST_VAL;
        } else if (reversiSetting.GameSpd == DEF_GAME_SPD_MID) {
            reversiSetting.PlayCpuInterVal = DEF_GAME_SPD_MID_VAL2;
            reversiSetting.PlayDrawInterVal = DEF_GAME_SPD_MID_VAL;
        } else if (reversiSetting.GameSpd == DEF_GAME_SPD_SLOW) {
            reversiSetting.PlayCpuInterVal = DEF_GAME_SPD_SLOW_VAL2;
            reversiSetting.PlayDrawInterVal = DEF_GAME_SPD_SLOW_VAL;
        }
        reversiSetting.EndAnim = Number($("#mEndAnim .active input").val());
        reversiSetting.MasuCntMenu = Number($("#mMasuCntMenu .active input").val());
        if (reversiSetting.MasuCntMenu == DEF_MASU_CNT_6) {
            reversiSetting.MasuCnt = DEF_MASU_CNT_6_VAL;
        } else if (reversiSetting.MasuCntMenu == DEF_MASU_CNT_8) {
            reversiSetting.MasuCnt = DEF_MASU_CNT_8_VAL;
        } else if (reversiSetting.MasuCntMenu == DEF_MASU_CNT_10) {
            reversiSetting.MasuCnt = DEF_MASU_CNT_10_VAL;
        } else if (reversiSetting.MasuCntMenu == DEF_MASU_CNT_12) {
            reversiSetting.MasuCnt = DEF_MASU_CNT_12_VAL;
        } else if (reversiSetting.MasuCntMenu == DEF_MASU_CNT_14) {
            reversiSetting.MasuCnt = DEF_MASU_CNT_14_VAL;
        } else if (reversiSetting.MasuCntMenu == DEF_MASU_CNT_16) {
            reversiSetting.MasuCnt = DEF_MASU_CNT_16_VAL;
        }

        var oldTheme = reversiSetting.Theme;
        reversiSetting.Theme = $("#mTheme .active input").val();
        $('head link[href=".\/css\/theme\/' + oldTheme + '\/bootstrap.min.css"]').remove();
        var addEle = '<link href=".\/css\/theme\/' + reversiSetting.Theme + '\/bootstrap.min.css" rel="stylesheet" media="screen">';
        $('head').append(addEle);

        reversiSetting.PlayerColor1 = $('#mPlayerColor1 input').val();
        reversiSetting.PlayerColor2 = $('#mPlayerColor2 input').val();
        reversiSetting.BackGroundColor = $('#mBackGroundColor input').val();
        reversiSetting.BorderColor = $('#mBorderColor input').val();

        storage.setItem('appSetting', JSON.stringify(reversiSetting));
        appInit();
        setSetting(reversiSetting);
        // reset();
        console.log(reversiSetting);
    });
    $('#appMenuModal').on('click', '.btn-warning', function() {
        // *** デフォルト設定 *** //
        reversiSetting = new ReversiSetting();
        set_menu_ui();
    });
    $('#appMenuModal').on('click', '.btn-default', function() {
        // *** キャンセル *** //
        reversiSetting = reversiSettingBk;
        set_menu_ui();
    });
    // *** ダイアログクローズイベント *** //
    $('#appMenuModal').on('hidden.bs.modal', function() {
        console.log("appMenuModal close");
    });

    var rs_timer = false;
    $(window).resize(function() {
        if (rs_timer !== false) {
            clearTimeout(rs_timer);
        }
        rs_timer = setTimeout(function() {
            // *** 画面リサイズ処理 *** //
            set_masu_size_squer();
        }, 200);
    });
});

$(window).load(function() {
    set_masu_size_squer();
});

function cnvHexToRgb(hexVal) {
    var str = hexVal.toString();

    if (str.length < 6) {
        // #abcをa,b,cに分割
        var hex_3digit = str.match(/^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})/);
        // aa
        var hex_r = hex_3digit[1] + hex_3digit[1];
        // bb
        var hex_g = hex_3digit[2] + hex_3digit[2];
        // cc
        var hex_b = hex_3digit[3] + hex_3digit[3];
    } else {
        // #abcdefをab,cd,efに分割
        var hex_6digit = str.match(/^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/);
        // ab
        var hex_r = hex_6digit[1];
        // cd
        var hex_g = hex_6digit[2];
        // ef
        var hex_b = hex_6digit[3];
    }

    // 16進数から10進数へ
    var rgb_r = parseInt(hex_r, 16);
    var rgb_g = parseInt(hex_g, 16);
    var rgb_b = parseInt(hex_b, 16);

    rgbObj = new Object();
    rgbObj.r = rgb_r;
    rgbObj.g = rgb_g;
    rgbObj.b = rgb_b;

    return rgbObj;
}

function cnvRgbToHex(r, g, b) {
    var rgb_r = r.toString(10);
    var rgb_g = g.toString(10);
    var rgb_b = b.toString(10);

    // 10進数から16進数へ
    var hex_r = (parseInt(rgb_r)).toString(16);
    var hex_g = (parseInt(rgb_g)).toString(16);
    var hex_b = (parseInt(rgb_b)).toString(16);

    // 1桁の場合は0をつける
    hex_r = hex_r.replace(/(^[0-9a-fA-F]{1}$)/, '0$1');
    hex_g = hex_g.replace(/(^[0-9a-fA-F]{1}$)/, '0$1');
    hex_b = hex_b.replace(/(^[0-9a-fA-F]{1}$)/, '0$1');

    var hex = '#' + hex_r + hex_g + hex_b;

    return hex;
}

function set_menu_ui() {
    $('#appMenuModal .appMenuGrp label').each(function() {
        $(this).removeClass('active');
    });
    var ele;
    ele = $('#mMode input[value="' + Number(reversiSetting.Mode) + '"]').parent().addClass('active');
    ele = $('#mType input[value="' + Number(reversiSetting.Type) + '"]').parent().addClass('active');
    ele = $('#mPlayer input[value="' + Number(reversiSetting.Player) + '"]').parent().addClass('active');
    ele = $('#mAssist input[value="' + Number(reversiSetting.Assist) + '"]').parent().addClass('active');
    ele = $('#mGameSpd input[value="' + Number(reversiSetting.GameSpd) + '"]').parent().addClass('active');
    ele = $('#mEndAnim input[value="' + Number(reversiSetting.EndAnim) + '"]').parent().addClass('active');
    ele = $('#mMasuCntMenu input[value="' + Number(reversiSetting.MasuCntMenu) + '"]').parent().addClass('active');
    ele = $('#mTheme input[value="' + reversiSetting.Theme + '"]').parent().addClass('active');
    ele = $('#mPlayerColor1 input').attr('value', reversiSetting.PlayerColor1);
    ele = $('#mPlayerColor1 input').minicolors('value', reversiSetting.PlayerColor1);
    ele = $('#mPlayerColor2 input').attr('value', reversiSetting.PlayerColor2);
    ele = $('#mPlayerColor2 input').minicolors('value', reversiSetting.PlayerColor2);
    ele = $('#mBackGroundColor input').attr('value', reversiSetting.BackGroundColor);
    ele = $('#mBackGroundColor input').minicolors('value', reversiSetting.BackGroundColor);
    ele = $('#mBorderColor input').attr('value', reversiSetting.BorderColor);
    ele = $('#mBorderColor input').minicolors('value', reversiSetting.BorderColor);
    var oldTheme = reversiSetting.Theme;
    $('head link[href=".\/css\/theme\/' + oldTheme + '\/bootstrap.min.css"]').remove();
    var addEle = '<link href=".\/css\/theme\/' + reversiSetting.Theme + '\/bootstrap.min.css" rel="stylesheet" media="screen">';
    $('head').append(addEle);
}

function set_masu_size_squer() {
    var devHeight = $(window).height();
    var devWidth = $(window).width();
    var devOffset = 100;
    var masuSize;
    var viewSize;
    console.log('height : ' + devHeight + 'px');
    console.log('width : ' + devWidth + 'px');
    if (devHeight < devWidth) {
        // *** 縦幅の方が狭い *** //
        viewSize = (devHeight - devOffset);
    } else {
        // *** 横幅の方が狭い *** //
        viewSize = (devWidth - devOffset);
    }
    masuSize = (viewSize / reversiSetting.MasuCnt);
    $('.reversi_field').width((Math.ceil(masuSize * reversiSetting.MasuCnt) + 1) + 'px');
    $('.reversi_field').height((Math.ceil(masuSize * reversiSetting.MasuCnt) + 1) + 'px');
    $('.reversi_field .square-wrapper').each(function() {
        $(this).css('width', masuSize + 'px');
        $(this).css('height', masuSize + 'px');
    });
    $('.reversi_field .square-wrapper .content').each(function() {
        $(this).css('line-height', (masuSize * 0.9) + 'px');
    });
}

function appInit() {
    $('.reversi_field').empty();
    for (var i = 0; i < reversiSetting.MasuCnt; i++) {
        var row = $('<div class="my_row"><\/div>');
        row.addClass('pos_row' + String(i));
        $('.reversi_field').append(row);
        for (var j = 0; j < reversiSetting.MasuCnt; j++) {
            var ele = $('<div class="square-wrapper"><div class="spacer"><div class="content"><\/div><\/div><\/div>');
            ele.addClass('pos_x' + String(j));
            ele.addClass('pos_y' + String(i));
            ele.attr('data-x', String(j));
            ele.attr('data-y', String(i));
            ele.css('border-color', reversiSetting.BorderColor);
            $('.pos_row' + String(i)).append(ele);
        }
    }
    $('.reversi_field').append('<div class="clearfix"><\/div>');
    // *** メッセージ領域配置 *** //
    $('.reversi_field').append('<div class="cur_col_msg"><\/div>');
    $('.reversi_field').append('<div class="cur_sts_msg"><\/div>');
    // *** ボタン配置 *** //
    $('.reversi_field').append('<div class="col-xs-3">&nbsp;<\/div>');
    $('.reversi_field').append('<div class="col-xs-3"><button type="button" class="btn btn-primary btn-sm reset">リセット<\/button><\/div>');
    $('.reversi_field').append('<div class="col-xs-3"><button type="button" class="btn btn-info btn-sm setting" data-toggle="modal" data-target="#appMenuModal">設定<\/button><\/div>');
    $('.reversi_field').append('<div class="col-xs-3">&nbsp;<\/div>');
    $('.reversi_field').append('<div class="clearfix"><\/div>');
    drawAll();
    set_masu_size_squer();
}

function drawAll() {
    $('.reversi_field .square-wrapper').each(function(index, element) {
        var curX = $(this).data('x');
        var curY = $(this).data('y');
        drawSingle(curY, curX, REVERSI_STS_NONE, 0, '');
    });
}

function viewMsgDlg(title, msg) {
    alert(title + '\n' + msg);
}

function drawSingle(y, x, sts, bk, text) {
    var tgtEle = $('.reversi_field .square-wrapper[data-x="' + x + '"][data-y="' + y + '"]');
    var tgtEle2 = tgtEle.find('.content');
    // *** 石の状態変更 *** //
    if (sts == REVERSI_STS_NONE) {
        tgtEle2.removeClass('stone_white');
        tgtEle2.removeClass('stone_black');
        tgtEle2.css('background-color', 'transparent');
    } else if (sts == REVERSI_STS_BLACK) {
        tgtEle2.removeClass('stone_white');
        tgtEle2.addClass('stone_black');
        tgtEle2.css('background-color', reversiSetting.PlayerColor1);
    } else if (sts == REVERSI_STS_WHITE) {
        tgtEle2.addClass('stone_white');
        tgtEle2.removeClass('stone_black');
        tgtEle2.css('background-color', reversiSetting.PlayerColor2);
    }
    // *** マスの状態変更 *** //
    var bkCol = reversiSetting.BackGroundColor;
    if (bk == 1) {
        tgtEle.removeClass('cell_back_green');
        tgtEle.removeClass('cell_back_magenta');
        tgtEle.removeClass('cell_back_red');
        tgtEle.addClass('cell_back_blue');
        // *** 色変換 *** //
        var cnvCol = cnvHexToRgb(bkCol);
        cnvCol.g -= 127;
        if (cnvCol.g < 0) cnvCol.g += 255;
        cnvCol.b += 255;
        if (255 < cnvCol.b) cnvCol.b -= 255;
        bkCol = cnvRgbToHex(cnvCol.r, cnvCol.g, cnvCol.b);
    } else if (bk == 2) {
        tgtEle.removeClass('cell_back_green');
        tgtEle.removeClass('cell_back_magenta');
        tgtEle.addClass('cell_back_red');
        tgtEle.removeClass('cell_back_blue');
        // *** 色変換 *** //
        var cnvCol = cnvHexToRgb(bkCol);
        cnvCol.r += 255;
        if (255 < cnvCol.r) cnvCol.r -= 255;
        cnvCol.g -= 127;
        if (cnvCol.g < 0) cnvCol.g += 255;
        cnvCol.b -= 127;
        if (cnvCol.b < 0) cnvCol.b += 255;
        bkCol = cnvRgbToHex(cnvCol.r, cnvCol.g, cnvCol.b);
    } else if (bk == 3) {
        tgtEle.removeClass('cell_back_green');
        tgtEle.addClass('cell_back_magenta');
        tgtEle.removeClass('cell_back_red');
        tgtEle.removeClass('cell_back_blue');
        // *** 色変換 *** //
        var cnvCol = cnvHexToRgb(bkCol);
        cnvCol.r += 255;
        if (255 < cnvCol.r) cnvCol.r -= 255;
        cnvCol.b += 255;
        if (255 < cnvCol.b) cnvCol.b -= 255;
        bkCol = cnvRgbToHex(cnvCol.r, cnvCol.g, cnvCol.b);
    } else {
        tgtEle.addClass('cell_back_green');
        tgtEle.removeClass('cell_back_magenta');
        tgtEle.removeClass('cell_back_red');
        tgtEle.removeClass('cell_back_blue');
    }
    tgtEle.css('background-color', bkCol);
    // *** テキストの状態変更 *** //
    if (text == '0' || text == 0) {
        text = "";
    }
    tgtEle2.text(text);
}

function curColMsg(text) {
    $('.cur_col_msg').text(text);
}

function curStsMsg(text) {
    $('.cur_sts_msg').text(text);
}