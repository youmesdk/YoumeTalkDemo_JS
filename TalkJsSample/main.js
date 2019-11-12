/**
 * A brief explanation for "project.json":
 * Here is the content of project.json file, this is the global configuration for your game, you can modify it to customize some behavior.
 * The detail of each field is under it.
 {
    "project_type": "javascript",
    // "project_type" indicate the program language of your project, you can ignore this field

    "debugMode"     : 1,
    // "debugMode" possible values :
    //      0 - No message will be printed.
    //      1 - cc.error, cc.assert, cc.warn, cc.log will print in console.
    //      2 - cc.error, cc.assert, cc.warn will print in console.
    //      3 - cc.error, cc.assert will print in console.
    //      4 - cc.error, cc.assert, cc.warn, cc.log will print on canvas, available only on web.
    //      5 - cc.error, cc.assert, cc.warn will print on canvas, available only on web.
    //      6 - cc.error, cc.assert will print on canvas, available only on web.

    "showFPS"       : true,
    // Left bottom corner fps information will show when "showFPS" equals true, otherwise it will be hide.

    "frameRate"     : 60,
    // "frameRate" set the wanted frame rate for your game, but the real fps depends on your game implementation and the running environment.

    "noCache"       : false,
    // "noCache" set whether your resources will be loaded with a timestamp suffix in the url.
    // In this way, your resources will be force updated even if the browser holds a cache of it.
    // It's very useful for mobile browser debugging.

    "id"            : "gameCanvas",
    // "gameCanvas" sets the id of your canvas element on the web page, it's useful only on web.

    "renderMode"    : 0,
    // "renderMode" sets the renderer type, only useful on web :
    //      0 - Automatically chosen by engine
    //      1 - Forced to use canvas renderer
    //      2 - Forced to use WebGL renderer, but this will be ignored on mobile browsers

    "engineDir"     : "frameworks/cocos2d-html5/",
    // In debug mode, if you use the whole engine to develop your game, you should specify its relative path with "engineDir",
    // but if you are using a single engine file, you can ignore it.

    "modules"       : ["cocos2d"],
    // "modules" defines which modules you will need in your game, it's useful only on web,
    // using this can greatly reduce your game's resource size, and the cocos console tool can package your game with only the modules you set.
    // For details about modules definitions, you can refer to "../../frameworks/cocos2d-html5/modulesConfig.json".

    "jsList"        : [
    ]
    // "jsList" sets the list of js files in your game.
 }
 *
 */

cc.game.onStart = function(){
    if(!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));

    // Pass true to enable retina display, on Android disabled by default to improve performance
    cc.view.enableRetina(cc.sys.os === cc.sys.OS_IOS ? true : false);

    // Adjust viewport meta
    cc.view.adjustViewPort(true);

    // Uncomment the following line to set a fixed orientation for your game
    // cc.view.setOrientation(cc.ORIENTATION_PORTRAIT);

    // Setup the resolution policy and design resolution size
    cc.view.setDesignResolutionSize(1024, 768, cc.ResolutionPolicy.SHOW_ALL);

    // The game will be resized when browser size change
    cc.view.resizeWithBrowserSize(true);

    //初始化，随机用户ID，固定房间ID
    var date = new Date();
    g_userID = "u"+(date.getTime() % 1000);
    g_roomName = "123";

    //load resources
    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new LoginScene());
    }, this);

    /**
     *  功能描述:初始化引擎
     *
     *  @param pEventCallback:回调类地址，需要继承IYouMeEventCallback并实现其中的回调函数
     *  @param strAPPKey:在申请SDK注册时得到的App Key，也可凭账号密码到http://gmx.dev.net/createApp.html查询
     *  @param strAPPSecret:在申请SDK注册时得到的App Secret，也可凭账号密码到http://gmx.dev.net/createApp.html查询
     *  @param serverRegionId: 服务器区域(YOUME_RTC_SERVER_REGION)
     *  @param pExtServerRegionName:
     *  @return 错误码，详见YouMeConstDefine.h定义
    */
    var ymErrorcode = youmetalk.talk_Init("YOUMEBC2B3171A7A165DC10918A7B50A4B939F2A187D0",
        "r1+ih9rvMEDD3jUoU+nj8C7VljQr7Tuk4TtcByIdyAqjdl5lhlESU0D+SoRZ30sopoaOBg9EsiIMdc8R16WpJPNwLYx2WDT5hI/HsLl1NJjQfa9ZPuz7c/xVb8GHJlMf/wtmuog3bHCpuninqsm3DRWiZZugBTEj2ryrhK7oZncBAAE=",
        0, "cn");

    if(ymErrorcode != 0 )
    {
        cc.log("初始化失败，错误码：%d\n",  ymErrorcode);
    }
    else{
        cc.log("初始化成功!\n");
    }

    //进入后台
    cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function(){
        //YOUME
        //进入后台
        /**
         *  功能描述: 暂停通话，释放麦克风等设备资源
         *  @return YOUME_SUCCESS - 成功
         *          其他 - 具体错误码
         */
        var errorcode = youmetalk.talk_PauseChannel();
        cc.log("OnPause:" + errorcode );
    });

    //恢复显示
    cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function(){
        //YOUME
        //进入前台
        /**
         *  功能描述: 恢复通话
         *  @return YOUME_SUCCESS - 成功
         *          其他 - 具体错误码
         */
        var errorcode =youmetalk.talk_ResumeChannel();
        cc.log("OnResume:" + errorcode );
    });
};

cc.game.onStop = function () {
    cc.log("onStop");
};

cc.game.run();



