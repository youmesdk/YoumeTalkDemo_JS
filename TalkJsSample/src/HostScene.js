var HostLayer = cc.Layer.extend({
    labelTips: null,

    ctor: function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        this.addVoiceEventListener();
        this.loadCommonUI();
        if( g_roleType === 5 ){
            this.loadHostUI();
            //进入房间，设置初始的麦克风，扬声器状态和音量
            //主播模式，默认麦克风关闭，上麦才启用
            youmetalk.talk_SetMicrophoneMute( true );
            youmetalk.talk_SetSpeakerMute( false );
            youmetalk.talk_SetVolume(70);
        }
        else{
            //进入房间，设置初始的麦克风，扬声器状态和音量
            //听众模式，麦克风静音
            youmetalk.talk_SetMicrophoneMute( true);
            youmetalk.talk_SetSpeakerMute( false );
            youmetalk.talk_SetVolume(70);
        }

    
        return true;
    },

    addVoiceEventListener: function(){
        var mythis = this;
        //收到YoumeTalk的提示消息
        var tipsListener = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"Tips",
            callback:function (event) {
                var tips = event.getUserData();
                mythis.addTips( tips );
            }
        });
        cc.eventManager.addListener( tipsListener ,1);
    },

    addTips : function ( tips ){
        this.labelTips.setString( tips );
    },

    loadCommonUI: function(){
        var visibleSize = cc.director.getVisibleSize();

        var labelID = cc.LabelTTF("", "Arial", 40);
        labelID.setFontFillColor( cc.color.WHITE );
        labelID.setPosition( 20, visibleSize.height - 80);
        labelID.setAnchorPoint( 0,0) ;
        this.addChild( labelID );
        labelID.setString("用户:"+g_userID);

        var labelRoom = cc.LabelTTF("", "Arial", 40);
        labelRoom.setFontFillColor( cc.color.WHITE );
        labelRoom.setPosition( 20, visibleSize.height - 160);
        labelRoom.setAnchorPoint( 0,0) ;
        this.addChild( labelRoom );
        labelRoom.setString("频道:"+g_roomName);

        this.labelTips = cc.LabelTTF("", "Arial", 40);
        this.labelTips.setFontFillColor( cc.color.WHITE );
        this.labelTips.setPosition(0,0);
        this.labelTips.setAnchorPoint( 0,0) ;
        this.addChild( this.labelTips );

        var btnExit = ccui.Button();
        btnExit.setTitleFontSize(80);
        btnExit.setPosition(visibleSize.width - 100 , 10);
        btnExit.setAnchorPoint(0.5, 0);
        btnExit.setTitleText("退出");
        btnExit.setTitleColor( cc.color.WHITE );
        this.addChild( btnExit );
        btnExit.addClickEventListener( function () {
            //取消事件注册
            cc.eventManager.removeCustomListeners("Tips");

            /**
             *  功能描述:退出所有语音频道
             *
             *  @return 错误码，详见YouMeConstDefine.h定义
            */
            var errorcode = youmetalk.talk_LeaveChannelAll();
            if( 0 === errorcode )
            {
                cc.log("调用退出所有频道成功\n");
            }
            else
            {
                cc.log("调用退出所有频道失败，错误码：%d\n",  errorcode);
            }

            //切换回登录界面
            var scene = new LoginScene();
            cc.director.replaceScene( scene );
        });
    },

    valueChanged: function( sender, controlEvent ){
        var vol = parseInt( sender.getValue() );
        /**
         *  功能描述: 设置背景音乐播放的音量
         *  @param vol 背景音乐的音量，范围 0-100
         *  @return YOUME_SUCCESS - 成功
         *          其他 - 具体错误码
         */
        var errorcode = youmetalk.talk_SetBackgroundMusicVolume( vol );
        cc.log("设置背景音乐音量:%d，错误码：%d\n", vol,  errorcode);

        addTips("设置音乐音量" + vol );
    },

    loadHostUI : function (){
        var visibleSize = cc.director.getVisibleSize();

        //
        var btnOpenMic = ccui.Button();
        btnOpenMic.setTitleFontSize(80);
        btnOpenMic.setPosition(300 , 280);
        btnOpenMic.setAnchorPoint(0.5, 0);
        btnOpenMic.setTitleText("上麦");
        btnOpenMic.setTitleColor( cc.color.WHITE );
        this.addChild( btnOpenMic );
        btnOpenMic.addClickEventListener( function () {
            /**
             *  功能描述:设置麦克风静音
             *
             *  @param bOn:true——静音，false——取消静音
             *  @return 无
             */
            youmetalk.talk_SetMicrophoneMute(false);
            addTips("上麦");
            cc.log("上麦\n");
        });

        var btnCloseMic = ccui.Button();
        btnCloseMic.setTitleFontSize(80);
        btnCloseMic.setPosition(300 , 180);
        btnCloseMic.setAnchorPoint(0.5, 0);
        btnCloseMic.setTitleText("下麦");
        btnCloseMic.setTitleColor( cc.color.WHITE );
        this.addChild( btnCloseMic );
        btnCloseMic.addClickEventListener( function () {
            /**
             *  功能描述:设置麦克风静音
             *
             *  @param bOn:true——静音，false——取消静音
             *  @return 无
             */
            youmetalk.talk_SetMicrophoneMute( true );

            addTips("下麦");
            cc.log("下麦\n");
        });

        var btnPlayMusic = ccui.Button();
        btnPlayMusic.setTitleFontSize(80);
        btnPlayMusic.setPosition(700 , 280);
        btnPlayMusic.setAnchorPoint(0.5, 0);
        btnPlayMusic.setTitleText("播放音乐");
        btnPlayMusic.setTitleColor( cc.color.WHITE );
        this.addChild( btnPlayMusic );
        btnPlayMusic.addClickEventListener( function () {
            var path = ""
            //android平台直接播放资源目录下的音乐有问题，这里写死个sdcard的路径
            //请大家调用的时候自己换合适的路径
            if (cc.sys.os == cc.sys.OS_ANDROID )
                path = "/sdcard/temp/shinian.mp3"
            else
                path = jsb.fileUtils.fullPathForFilename( "res/music/shinian.mp3" );

            /**
             *  功能描述: 如果当前正在播放背景音乐的话，停止播放
             *  @return YOUME_SUCCESS - 成功
             *          其他 - 具体错误码
             */
            var errorcode = youmetalk.talk_PlayBackgroundMusic( path, false );
            addTips("播放音乐");
            if( 0 == errorcode)
            {
                cc.log("调用播放音乐成功，%s\n", path);
            }   
            else
            {
                cc.log("调用播放音乐失败，错误码：%d, %s\n",  errorcode, path);
            }
        });

        var btnStopMusic = ccui.Button();
        btnStopMusic.setTitleFontSize(80);
        btnStopMusic.setPosition(700 , 180);
        btnStopMusic.setAnchorPoint(0.5, 0);
        btnStopMusic.setTitleText("停止音乐");
        btnStopMusic.setTitleColor( cc.color.WHITE );
        this.addChild( btnStopMusic );
        btnStopMusic.addClickEventListener( function () {
            /**
             *  功能描述: 如果当前正在播放背景音乐的话，停止播放
             *  @return YOUME_SUCCESS - 成功
             *          其他 - 具体错误码
             */
            var errorcode = youmetalk.talk_StopBackgroundMusic();
            addTips("停止音乐");
            if( 0 == errorcode)
            {
                cc.log("调用停止音乐成功\n");
            }   
            else
            {
                cc.log("调用停止音乐失败，错误码：%d\n",  errorcode);
            }

        });

        var slider = new cc.ControlSlider("res/sliderTrack.png", "res/sliderProgress.png", "res/sliderThumb.png");
        slider.setMinimumValue(0.0); // Sets the min value of range
        slider.setMaximumValue(100.0); // Sets the max value of range
        slider.setAnchorPoint(0.5, 1 );
        slider.setPosition( 700, 100 );
        slider.addTargetWithActionForControlEvents( this, this.valueChanged, cc.CONTROL_EVENT_VALUECHANGED );
        this.addChild( slider );
        var vol = 80;
        slider.setValue( 80 );

    }
});

var HostScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HostLayer();
        this.addChild(layer);
    }
});
