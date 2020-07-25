var ReversiSettingWrap;
(function (ReversiSettingWrap) {
    var ReversiConst = require("./ReversiConst");
    module.exports = (function () {
        function ReversiSetting() {
            this.mMode = ReversiConst.DEF_MODE_ONE;
            this.mType = ReversiConst.DEF_TYPE_HARD;
            this.mPlayer = ReversiConst.REVERSI_STS_BLACK;
            this.mAssist = ReversiConst.DEF_ASSIST_ON;
            this.mGameSpd = ReversiConst.DEF_GAME_SPD_MID;
            this.mEndAnim = ReversiConst.DEF_END_ANIM_ON;
            this.mMasuCntMenu = ReversiConst.DEF_MASU_CNT_8;
            this.mMasuCnt = ReversiConst.DEF_MASU_CNT_8_VAL;
            this.mPlayCpuInterVal = ReversiConst.DEF_GAME_SPD_MID_VAL2;
            this.mPlayDrawInterVal = ReversiConst.DEF_GAME_SPD_MID_VAL;
            this.mEndDrawInterVal = 100;
            this.mEndInterVal = 500;
            this.mTheme = "Cerulean";
            this.mPlayerColor1 = "#000000";
            this.mPlayerColor2 = "#FFFFFF";
            this.mBackGroundColor = "#00FF00";
            this.mBorderColor = "#000000";
        }
        return ReversiSetting;
    }());
})(ReversiSettingWrap || (ReversiSettingWrap = {}));
//# sourceMappingURL=ReversiSetting.js.map