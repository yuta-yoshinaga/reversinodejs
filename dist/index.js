var express = require("express");
var cookieParser = require('cookie-parser');
var session = require("express-session");
var app = express();
var port = 3000;
var ReversiPlay = require("./ReversiPlay");
var ReversiSetting = require("./ReversiSetting");
var CallbacksJson = require("./CallbacksJson");
var ReversiPlayDelegate = require("./ReversiPlayDelegate");
var ReversiPlayInterfaceImpl = require("./ReversiPlayInterfaceImpl");
var ResJson = require("./ResJson");
var sess = {
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxage: 1000 * 60 * 30,
    },
};
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session(sess));
app.post("/FrontController", function (req, res) {
    var rvPlay = new ReversiPlay();
    if (req.session.rvPlay == null || req.session.rvPlay == undefined) {
        console.log("session init!");
    }
    else {
        rvPlay.setSession(req.session.rvPlay);
    }
    rvPlay.setmDelegate(new ReversiPlayDelegate(new ReversiPlayInterfaceImpl()));
    rvPlay.setmCallbacks(new CallbacksJson());
    var resJson = new ResJson();
    if (req.body.func == "setSetting") {
        var para = JSON.parse(req.body.para);
        var reversiSetting = new ReversiSetting();
        reversiSetting.mMode = para.Mode;
        reversiSetting.mType = para.Type;
        reversiSetting.mPlayer = para.Player;
        reversiSetting.mAssist = para.Assist;
        reversiSetting.mGameSpd = para.GameSpd;
        reversiSetting.mEndAnim = para.EndAnim;
        reversiSetting.mMasuCntMenu = para.MasuCntMenu;
        reversiSetting.mMasuCnt = para.MasuCnt;
        reversiSetting.mPlayCpuInterVal = para.PlayCpuInterVal;
        reversiSetting.mPlayDrawInterVal = para.PlayDrawInterVal;
        reversiSetting.mEndDrawInterVal = para.EndDrawInterVal;
        reversiSetting.mEndInterVal = para.EndInterVal;
        reversiSetting.mTheme = para.Theme;
        reversiSetting.mPlayerColor1 = para.PlayerColor1;
        reversiSetting.mPlayerColor2 = para.PlayerColor2;
        reversiSetting.mBackGroundColor = para.BackGroundColor;
        reversiSetting.mBorderColor = para.BorderColor;
        rvPlay.setSetting(reversiSetting);
        rvPlay.reset();
        resJson.Auth = "[SUCCESS]";
    }
    else if (req.body.func == "reset") {
        rvPlay.reset();
        resJson.Auth = "[SUCCESS]";
    }
    else if (req.body.func == "reversiPlay") {
        rvPlay.reversiPlay(Number(req.body.y), Number(req.body.x));
        resJson.Auth = "[SUCCESS]";
    }
    resJson.Callbacks = rvPlay.getmCallbacks();
    req.session.rvPlay = rvPlay;
    res.header("Content-Type", "application/json; charset=utf-8");
    res.send(resJson);
});
app.listen(port, function () { return console.log("Example app listening on port " + port + "!"); });
//# sourceMappingURL=index.js.map